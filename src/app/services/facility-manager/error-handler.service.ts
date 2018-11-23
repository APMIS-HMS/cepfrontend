import { Injectable, ErrorHandler } from '@angular/core';
import { SystemModuleService } from '../module-manager/setup/system-module.service';

@Injectable()
export class ApmisErrorHandler extends ErrorHandler {
	constructor(private systemModuleService: SystemModuleService) {
		super();
	}

	handleError(err) {
		this.systemModuleService.off();
		// const date = new Date();
		// console.error('There was an error:', {
		// 	timestamp: date.toISOString(),
		// 	'stack-track': err.stack,
		// 	message: err.message,
		// 	zone: err.zone,
		// 	task: err.task
		// });
	}
}
