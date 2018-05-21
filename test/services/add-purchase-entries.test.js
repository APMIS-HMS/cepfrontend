const assert = require('assert');
const app = require('../../src/app');

describe('\'add-purchase-entries\' service', () => {
  it('registered the service', () => {
    const service = app.service('add-purchase-entries');

    assert.ok(service, 'Registered the service');
  });
});
