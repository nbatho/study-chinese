import beApi from '../callApi';
import { apiRequest } from '../shared';
import type { HealthStatus } from './types';

export const healthApi = {
    check: () => apiRequest<HealthStatus>(beApi.get('health')),

    getSwaggerJson: () => beApi.get('docs/swagger.json'),
};

export * from './types';
