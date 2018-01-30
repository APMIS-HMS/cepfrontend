const assert = require('assert');
const app = require('../../src/app');

describe('\'upload-facade\' service', () => {
  it('registered the service', () => {
    const service = app.service('upload-facade');

    assert.ok(service, 'Registered the service');
  });
});
