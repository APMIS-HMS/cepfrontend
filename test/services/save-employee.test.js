const assert = require('assert');
const app = require('../../src/app');

describe('\'save-employee\' service', () => {
  it('registered the service', () => {
    const service = app.service('save-employee');

    assert.ok(service, 'Registered the service');
  });
});
