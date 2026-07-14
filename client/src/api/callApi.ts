import axios from 'axios';
import type {
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosResponse,
} from 'axios';
import { toast } from 'sonner';
import { getAccessToken, hasAuthSession, removeAccessToken, setAccessToken } from '../utils/authSession';
import { ApiError, type ApiErrorPayload } from '../utils/errorUtils';

interface RefreshResponse {
    status: 'success';
    data: {
        accessToken: string;
    };
}

type RetryableRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

const PUBLIC_ENDPOINTS = [
    'auth/login',
    'auth/register',
    'health',
    'docs',
    'ocr/translate',
    'vocab',
    'vocabulary',
    'lessons/sample-list',
    'lessons/public',
];

const normalizeUrl = (url?: string) => {
    if (!url) {
        return '';
    }

    try {
        const parsed = new URL(url, window.location.origin);
        return parsed.pathname.replace(/^\/api\/v1\/?/, '').replace(/^\//, '');
    } catch {
        return url.replace(/^\/?api\/v1\/?/, '').replace(/^\//, '');
    }
};

const isPublicEndpoint = (url?: string) => {
    const normalizedUrl = normalizeUrl(url);
    return PUBLIC_ENDPOINTS.some((endpoint) => normalizedUrl.startsWith(endpoint));
};

const STATUS_TOAST_MAP: Record<number, string> = {
    401: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
    403: 'Bạn không có quyền thực hiện thao tác này.',
    404: 'Không tìm thấy dữ liệu yêu cầu.',
    409: 'Dữ liệu bị xung đột. Vui lòng kiểm tra lại.',
    429: 'Quá nhiều yêu cầu. Vui lòng đợi một lúc rồi thử lại.',
    500: 'Máy chủ gặp sự cố. Vui lòng thử lại sau.',
    502: 'Dịch vụ tạm thời không khả dụng. Vui lòng thử lại.',
    503: 'Máy chủ đang bảo trì. Vui lòng thử lại sau.',
};

function createAxiosInstance(baseURL: string): AxiosInstance {
    const instance = axios.create({
        baseURL,
        withCredentials: true,
        timeout: 15000,
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const refreshClient = axios.create({
        baseURL,
        withCredentials: true,
        timeout: 15000,
        headers: {
            'Content-Type': 'application/json',
        },
    });
    let refreshRequest: Promise<string> | null = null;

    const refreshAccessToken = async () => {
        refreshRequest ??= refreshClient
            .post<RefreshResponse>('auth/refresh')
            .then((response) => {
                const token = response.data.data.accessToken;
                setAccessToken(token);
                return token;
            })
            .finally(() => {
                refreshRequest = null;
            });

        return refreshRequest;
    };

    instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const token = getAccessToken();

            if (!token && !hasAuthSession() && !isPublicEndpoint(config.url)) {
                return Promise.reject(new axios.CanceledError('Auth session required'));
            }

            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error: unknown) => Promise.reject(error),
    );

    const rejectConnectionError = (error: unknown) => {
        const isTimeout = axios.isAxiosError(error) && error.code === 'ECONNABORTED';
        toast.error(
            isTimeout
                ? 'Yêu cầu mất quá nhiều thời gian. Vui lòng thử lại.'
                : 'Không có kết nối mạng. Vui lòng kiểm tra lại.',
            { id: 'network-error' },
        );
        return Promise.reject(new Error(isTimeout ? 'Request timeout' : 'Network Error'));
    };

    const shouldAttemptRefresh = (
        status: number,
        request: RetryableRequestConfig | undefined,
        isRefreshRequest: boolean,
    ): request is RetryableRequestConfig =>
        status === 401 &&
        request !== undefined &&
        !request._retry &&
        !isRefreshRequest &&
        !request.url?.includes('auth/logout') &&
        hasAuthSession();

    const retryWithFreshToken = async (request: RetryableRequestConfig) => {
        request._retry = true;

        try {
            const token = await refreshAccessToken();

            if (request.headers) {
                request.headers.Authorization = `Bearer ${token}`;
            }

            return await instance(request);
        } catch {
            removeAccessToken();
            toast.error(STATUS_TOAST_MAP[401], { id: 'unauthorized' });
            return Promise.reject(new Error('Unauthorized'));
        }
    };

    const buildApiError = (status: number, data: unknown) => {
        const payload: ApiErrorPayload = {
            status: status >= 500 ? 'error' : 'fail',
            errorCode: (data as ApiErrorPayload)?.errorCode ?? 'UNKNOWN',
            message:
                (data as ApiErrorPayload)?.message ??
                (data as { error?: string })?.error ??
                STATUS_TOAST_MAP[status] ??
                'Đã có lỗi xảy ra',
            details: (data as ApiErrorPayload)?.details,
        };

        return new ApiError(payload, status);
    };

    instance.interceptors.response.use(
        (response: AxiosResponse) => response.data,

        async (error: unknown) => {
            if (axios.isCancel(error)) {
                return Promise.reject(error);
            }

            if (!axios.isAxiosError(error) || !error.response) {
                return rejectConnectionError(error);
            }

            const { status, data } = error.response;
            const originalRequest = error.config as RetryableRequestConfig | undefined;
            const isRefreshRequest = Boolean(originalRequest?.url?.includes('auth/refresh'));

            if (shouldAttemptRefresh(status, originalRequest, isRefreshRequest)) {
                return retryWithFreshToken(originalRequest);
            }

            const apiError = buildApiError(status, data);

            if (status === 401) {
                removeAccessToken();

                if (!isRefreshRequest) {
                    toast.error(STATUS_TOAST_MAP[401], { id: 'unauthorized' });
                }
            } else {
                toast.error(STATUS_TOAST_MAP[status] ?? apiError.message, { id: `err-${status}` });
            }

            return Promise.reject(apiError);
        },
    );

    return instance;
}

// ─────────────────────────────────────────────────────────────
// Export instance
// ─────────────────────────────────────────────────────────────
const GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL;
const BASE_URL = GATEWAY_URL ? `${GATEWAY_URL}/api/v1/` : '/api/v1/';

export const beApi = createAxiosInstance(BASE_URL);
export default beApi;
