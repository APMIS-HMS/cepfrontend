const assert = require('assert');
const app = require('../../src/app');

describe('\'vitalRythms\' service', () => {
  it('registered the service', () => {
    const service = app.service('vital-rythms');

    assert.ok(service, 'Registered the service');
  });
});
