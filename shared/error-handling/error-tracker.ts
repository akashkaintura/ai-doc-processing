import { Injectable, ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import * as Sentry from '@sentry/node';

@Catch()
@Injectable()
export class ErrorTracker implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
        this.handleError(exception);
    }
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