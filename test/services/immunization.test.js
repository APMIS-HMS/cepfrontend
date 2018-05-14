const assert = require('assert');
const app = require('../../src/app');

describe('\'immunization\' service', () => {
  it('registered the service', () => {
    const service = app.service('immunization');

    assert.ok(service, 'Registered the service');
  });
});
