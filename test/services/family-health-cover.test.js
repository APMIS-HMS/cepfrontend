const assert = require('assert');
const app = require('../../src/app');

describe('\'familyHealthCover\' service', () => {
  it('registered the service', () => {
    const service = app.service('family-health-covered');

    assert.ok(service, 'Registered the service');
  });
});
