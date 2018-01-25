const assert = require('assert');
const app = require('../../src/app');

describe('\'fundWallet\' service', () => {
  it('registered the service', () => {
    const service = app.service('fund-wallet');

    assert.ok(service, 'Registered the service');
  });
});
