const assert = require('assert');
const app = require('../../src/app');

describe('\'drug-details-apis\' service', () => {
  it('registered the service', () => {
    const service = app.service('drug-details-apis');

    assert.ok(service, 'Registered the service');
  });
});
