const assert = require('assert');
const app = require('../../src/app');

describe('\'set-multiple-appointments\' service', () => {
  it('registered the service', () => {
    const service = app.service('set-multiple-appointments');

    assert.ok(service, 'Registered the service');
  });
});
