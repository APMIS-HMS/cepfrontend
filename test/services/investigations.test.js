const assert = require('assert');
const app = require('../../src/app');

describe('\'investigations\' service', () => {
  it('registered the service', () => {
    const service = app.service('investigations');

    assert.ok(service, 'Registered the service');
  });
});
