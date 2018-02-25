const assert = require('assert');
const app = require('../../src/app');

describe('\'get-bed-occupancy\' service', () => {
  it('registered the service', () => {
    const service = app.service('get-bed-occupancy');

    assert.ok(service, 'Registered the service');
  });
});
