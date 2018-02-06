const assert = require('assert');
const app = require('../../src/app');

describe('\'vitals\' service', () => {
  it('registered the service', () => {
    const service = app.service('vitals');

    assert.ok(service, 'Registered the service');
  });
});
