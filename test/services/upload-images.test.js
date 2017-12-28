const assert = require('assert');
const app = require('../../src/app');

describe('\'upload-images\' service', () => {
  it('registered the service', () => {
    const service = app.service('upload-images');

    assert.ok(service, 'Registered the service');
  });
});
