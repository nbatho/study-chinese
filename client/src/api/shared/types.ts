export interface ApiResponse<T> {
    status: 'success';
    data: T;
}

export interface EmptyResponse {
    status: 'success';
    data: null;
}
