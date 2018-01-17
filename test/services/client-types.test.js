const assert = require('assert');
const app = require('../../src/app');

describe('\'clientTypes\' service', () => {
  it('registered the service', () => {
    const service = app.service('client-types');

    assert.ok(service, 'Registered the service');
  });
});
