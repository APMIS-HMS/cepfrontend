const assert = require('assert');
const app = require('../../src/app');

describe('\'organisation-services\' service', () => {
  it('registered the service', () => {
    const service = app.service('organisation-services');

    assert.ok(service, 'Registered the service');
  });
});
