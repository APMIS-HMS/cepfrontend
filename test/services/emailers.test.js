const assert = require('assert');
const app = require('../../src/app');

describe('\'emailers\' service', () => {
  it('registered the service', () => {
    const service = app.service('emailers');

    assert.ok(service, 'Registered the service');
  });
});
