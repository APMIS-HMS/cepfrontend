const assert = require('assert');
const app = require('../../src/app');

describe('\'laboratoryReports\' service', () => {
  it('registered the service', () => {
    const service = app.service('laboratory-reports');

    assert.ok(service, 'Registered the service');
  });
});
