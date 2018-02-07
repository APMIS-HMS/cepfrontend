const assert = require('assert');
const app = require('../../src/app');

describe('\'workbenches\' service', () => {
  it('registered the service', () => {
    const service = app.service('workbenches');

    assert.ok(service, 'Registered the service');
  });
});
