const assert = require('assert');
const app = require('../../src/app');

describe('\'companycovers\' service', () => {
  it('registered the service', () => {
    const service = app.service('companycovers');

    assert.ok(service, 'Registered the service');
  });
});
