const assert = require('assert');
const app = require('../../src/app');

describe('\'frequency\' service', () => {
  it('registered the service', () => {
    const service = app.service('frequencies');

    assert.ok(service, 'Registered the service');
  });
});
