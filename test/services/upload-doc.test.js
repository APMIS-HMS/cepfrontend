const assert = require('assert');
const app = require('../../src/app');

describe('\'upload-doc\' service', () => {
  it('registered the service', () => {
    const service = app.service('upload-doc');

    assert.ok(service, 'Registered the service');
  });
});
