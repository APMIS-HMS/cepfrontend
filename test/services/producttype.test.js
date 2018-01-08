const assert = require('assert');
const app = require('../../src/app');

describe('\'producttype\' service', () => {
  it('registered the service', () => {
    const service = app.service('producttype');

    assert.ok(service, 'Registered the service');
  });
});
