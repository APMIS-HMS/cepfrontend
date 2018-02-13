const assert = require('assert');
const app = require('../../src/app');

describe('\'associations\' service', () => {
  it('registered the service', () => {
    const service = app.service('associations');

    assert.ok(service, 'Registered the service');
  });
});
