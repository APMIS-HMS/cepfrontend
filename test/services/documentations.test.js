const assert = require('assert');
const app = require('../../src/app');

describe('\'documentations\' service', () => {
  it('registered the service', () => {
    const service = app.service('documentations');

    assert.ok(service, 'Registered the service');
  });
});
