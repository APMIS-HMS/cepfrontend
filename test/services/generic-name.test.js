const assert = require('assert');
const app = require('../../src/app');

describe('\'genericName\' service', () => {
  it('registered the service', () => {
    const service = app.service('generic-names');

    assert.ok(service, 'Registered the service');
  });
});
