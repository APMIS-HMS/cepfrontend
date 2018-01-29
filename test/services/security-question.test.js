const assert = require('assert');
const app = require('../../src/app');

describe('\'security-question\' service', () => {
  it('registered the service', () => {
    const service = app.service('security-questions');

    assert.ok(service, 'Registered the service');
  });
});
