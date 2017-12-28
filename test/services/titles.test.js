const assert = require('assert');
const app = require('../../src/app');

describe('\'titles\' service', () => {
  it('registered the service', () => {
    const service = app.service('titles');

    assert.ok(service, 'Registered the service');
  });
});
