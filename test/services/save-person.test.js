const assert = require('assert');
const app = require('../../src/app');

describe('\'save-person\' service', () => {
  it('registered the service', () => {
    const service = app.service('save-person');

    assert.ok(service, 'Registered the service');
  });
});
