const assert = require('assert');
const app = require('../../src/app');

describe('\'employee-search\' service', () => {
  it('registered the service', () => {
    const service = app.service('employee-search');

    assert.ok(service, 'Registered the service');
  });
});
