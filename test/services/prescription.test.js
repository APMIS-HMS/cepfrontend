const assert = require('assert');
const app = require('../../src/app');

describe('\'prescription\' service', () => {
  it('registered the service', () => {
    const service = app.service('prescription');

    assert.ok(service, 'Registered the service');
  });
});
