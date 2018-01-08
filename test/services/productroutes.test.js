const assert = require('assert');
const app = require('../../src/app');

describe('\'productroutes\' service', () => {
  it('registered the service', () => {
    const service = app.service('productroutes');

    assert.ok(service, 'Registered the service');
  });
});
