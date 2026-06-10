export interface HealthStatus {
    message: string;
    database: 'ok' | 'skipped';
    timestamp: string;
}
