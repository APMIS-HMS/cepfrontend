const assert = require('assert');
const app = require('../../src/app');

describe('\'employee-checkins\' service', () => {
  it('registered the service', () => {
    const service = app.service('employee-checkins');

    assert.ok(service, 'Registered the service');
  });
});
