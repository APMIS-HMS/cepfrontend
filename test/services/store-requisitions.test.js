const assert = require('assert');
const app = require('../../src/app');

describe('\'storeRequisitions\' service', () => {
  it('registered the service', () => {
    const service = app.service('store-requisitions');

    assert.ok(service, 'Registered the service');
  });
});
