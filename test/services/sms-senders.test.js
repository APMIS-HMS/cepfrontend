const assert = require('assert');
const app = require('../../src/app');

describe('\'smsSenders\' service', () => {
  it('registered the service', () => {
    const service = app.service('sms-senders');

    assert.ok(service, 'Registered the service');
  });
});
