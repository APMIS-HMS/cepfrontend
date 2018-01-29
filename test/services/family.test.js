const assert = require('assert');
const app = require('../../src/app');

describe('\'family\' service', () => {
  it('registered the service', () => {
    const service = app.service('families');

    assert.ok(service, 'Registered the service');
  });
});
