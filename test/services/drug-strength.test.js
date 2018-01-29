const assert = require('assert');
const app = require('../../src/app');

describe('\'drugStrength\' service', () => {
  it('registered the service', () => {
    const service = app.service('drug-strength');

    assert.ok(service, 'Registered the service');
  });
});
