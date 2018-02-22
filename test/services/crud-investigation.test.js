const assert = require('assert');
const app = require('../../src/app');

describe('\'crud-investigation\' service', () => {
  it('registered the service', () => {
    const service = app.service('crud-investigation');

    assert.ok(service, 'Registered the service');
  });
});
