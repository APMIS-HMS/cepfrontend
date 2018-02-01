const assert = require('assert');
const app = require('../../src/app');

describe('\'timezones\' service', () => {
  it('registered the service', () => {
    const service = app.service('timezones');

    assert.ok(service, 'Registered the service');
  });
});
