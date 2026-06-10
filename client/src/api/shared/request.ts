import type { ApiResponse, EmptyResponse } from './types';

export const apiRequest = <T>(request: Promise<unknown>) => request as Promise<ApiResponse<T>>;

export const emptyRequest = (request: Promise<unknown>) => request as Promise<EmptyResponse>;

export const unwrapApiData = async <T>(request: Promise<ApiResponse<T>>) => {
    const response = await request;
    return response.data;
};
