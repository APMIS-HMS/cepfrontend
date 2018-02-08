const assert = require('assert');
const app = require('../../src/app');

describe('\'insurance-enrollees\' service', () => {
  it('registered the service', () => {
    const service = app.service('insurance-enrollees');

    assert.ok(service, 'Registered the service');
  });
});
