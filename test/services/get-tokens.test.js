const assert = require('assert');
const app = require('../../src/app');

describe('\'getTokens\' service', () => {
  it('registered the service', () => {
    const service = app.service('get-tokens');

    assert.ok(service, 'Registered the service');
  });
});
