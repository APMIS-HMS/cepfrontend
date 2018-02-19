import { Injectable, ErrorHandler } from '@angular/core';

@Injectable()
export class ApmisErrorHandler extends ErrorHandler {
  constructor() {
    super();
  }

  handleError(err) {
    const date = new Date();
    console.error('There was an error:', {
      timestamp: date.toISOString(),
      'stack-track': err.stack,
      message: err.message,
      zone: err.zone,
      task: err.task
    });
  }
}
