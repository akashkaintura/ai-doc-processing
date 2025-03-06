import { Injectable, Logger } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ErrorTracker {
  private readonly logger = new Logger(ErrorTracker.name);

  constructor(private readonly elasticsearch: ElasticsearchService) {}

  capture(error: Error, context?: Record<string, any>) {
    this.logToSentry(error, context);
    this.logToElastic(error, context);
    this.logToConsole(error, context);
  }

  private logToSentry(error: Error, context?: Record<string, any>) {
    Sentry.withScope(scope => {
      if (context) scope.setExtras(context);
      Sentry.captureException(error);
    });
  }

  private async logToElastic(error: Error, context?: Record<string, any>) {
    try {
      await this.elasticsearch.index({
        index: 'error-logs',
        body: {
          timestamp: new Date().toISOString(),
          message: error.message,
          stack: error.stack,
          context
        }
      });
    } catch (err) {
      this.logger.error('Failed to log to Elasticsearch', err.stack);
    }
  }

  private logToConsole(error: Error, context?: Record<string, any>) {
    this.logger.error({
      message: error.message,
      stack: error.stack,
      context
    });
  }
}