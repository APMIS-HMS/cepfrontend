const assert = require('assert');
const app = require('../../src/app');

describe('\'bedTypes\' service', () => {
  it('registered the service', () => {
    const service = app.service('bed-types');

    assert.ok(service, 'Registered the service');
  });
});
