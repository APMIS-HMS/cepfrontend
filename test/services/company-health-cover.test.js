const assert = require('assert');
const app = require('../../src/app');

describe('\'companyHealthCover\' service', () => {
  it('registered the service', () => {
    const service = app.service('company-health-covers');

    assert.ok(service, 'Registered the service');
  });
});
