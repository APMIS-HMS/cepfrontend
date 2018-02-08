const assert = require('assert');
const app = require('../../src/app');

describe('\'severity\' service', () => {
  it('registered the service', () => {
    const service = app.service('severities');

    assert.ok(service, 'Registered the service');
  });
});
