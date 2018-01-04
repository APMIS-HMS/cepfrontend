const assert = require('assert');
const app = require('../../src/app');

describe('\'investigationReportTypes\' service', () => {
  it('registered the service', () => {
    const service = app.service('investigation-report-types');

    assert.ok(service, 'Registered the service');
  });
});
