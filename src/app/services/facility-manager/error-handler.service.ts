import { Injectable, ErrorHandler } from '@angular/core';

@Injectable()
export class ApmisErrorHandler extends ErrorHandler {
  constructor() {
    super();
  }

  handleError(err) {
    console.log(err);
    const date = new Date();
    console.error('There was an error:', {
      timestamp: date.toISOString(),
      message: err.message,
      zone: err.zone,
      task: err.task
    });
  }
}
