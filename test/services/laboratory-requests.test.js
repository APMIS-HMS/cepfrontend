const assert = require('assert');
const app = require('../../src/app');

describe('\'laboratoryRequests\' service', () => {
  it('registered the service', () => {
    const service = app.service('laboratory-requests');

    assert.ok(service, 'Registered the service');
  });
});
