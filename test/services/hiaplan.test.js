const assert = require('assert');
const app = require('../../src/app');

describe('\'hiaplan\' service', () => {
  it('registered the service', () => {
    const service = app.service('hiaplan');

    assert.ok(service, 'Registered the service');
  });
});
