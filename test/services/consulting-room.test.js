const assert = require('assert');
const app = require('../../src/app');

describe('\'consultingRoom\' service', () => {
  it('registered the service', () => {
    const service = app.service('consulting-rooms');

    assert.ok(service, 'Registered the service');
  });
});
