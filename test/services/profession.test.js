const assert = require('assert');
const app = require('../../src/app');

describe('\'profession\' service', () => {
  it('registered the service', () => {
    const service = app.service('profession');

    assert.ok(service, 'Registered the service');
  });
});
