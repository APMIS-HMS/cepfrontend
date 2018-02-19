const assert = require('assert');
const app = require('../../src/app');

describe('\'make-purchase-entries\' service', () => {
  it('registered the service', () => {
    const service = app.service('make-purchase-entries');

    assert.ok(service, 'Registered the service');
  });
});
