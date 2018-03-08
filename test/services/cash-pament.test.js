const assert = require('assert');
const app = require('../../src/app');

describe('\'cashPament\' service', () => {
  it('registered the service', () => {
    const service = app.service('cash-pament');

    assert.ok(service, 'Registered the service');
  });
});
