import { ErrorHandler } from '@nestjs/common';
import * as Sentry from '@sentry/node';

export class ErrorTracker implements ErrorHandler {
    handleError(error: any) {
        // Log to multiple destinations
        this.logToSentry(error);
        this.logToElastic(error);
        this.logToConsole(error);
    }

    private logToSentry(error: Error) {
        Sentry.captureException(error);
    }

    private logToElastic(error: Error) {
        // Implement Elasticsearch logging
    }

    private logToConsole(error: Error) {
        console.error(`[${new Date().toISOString()}]`, error);
    }
}