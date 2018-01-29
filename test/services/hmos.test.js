const assert = require('assert');
const app = require('../../src/app');

describe('\'hmos\' service', () => {
  it('registered the service', () => {
    const service = app.service('hmos');

    assert.ok(service, 'Registered the service');
  });
});
