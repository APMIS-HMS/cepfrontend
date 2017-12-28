const assert = require('assert');
const app = require('../../src/app');

describe('\'facilities\' service', () => {
  it('registered the service', () => {
    const service = app.service('facilities');

    assert.ok(service, 'Registered the service');
  });
});
