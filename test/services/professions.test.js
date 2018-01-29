const assert = require('assert');
const app = require('../../src/app');

describe('\'professions\' service', () => {
  it('registered the service', () => {
    const service = app.service('professions');

    assert.ok(service, 'Registered the service');
  });
});
