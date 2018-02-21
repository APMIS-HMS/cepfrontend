const assert = require('assert');
const app = require('../../src/app');

describe('\'drugStrengths\' service', () => {
  it('registered the service', () => {
    const service = app.service('drug-strengths');

    assert.ok(service, 'Registered the service');
  });
});
