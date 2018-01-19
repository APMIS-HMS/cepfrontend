const assert = require('assert');
const app = require('../../src/app');

describe('\'globalService\' service', () => {
  it('registered the service', () => {
    const service = app.service('global-services');

    assert.ok(service, 'Registered the service');
  });
});
