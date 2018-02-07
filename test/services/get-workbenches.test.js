const assert = require('assert');
const app = require('../../src/app');

describe('\'get-workbenches\' service', () => {
  it('registered the service', () => {
    const service = app.service('get-workbenches');

    assert.ok(service, 'Registered the service');
  });
});
