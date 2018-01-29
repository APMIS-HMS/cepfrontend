const assert = require('assert');
const app = require('../../src/app');

describe('\'prescription-priorities\' service', () => {
  it('registered the service', () => {
    const service = app.service('prescription-priorities');

    assert.ok(service, 'Registered the service');
  });
});
