const assert = require('assert');
const app = require('../../src/app');

describe('\'feature\' service', () => {
  it('registered the service', () => {
    const service = app.service('features');

    assert.ok(service, 'Registered the service');
  });
});
