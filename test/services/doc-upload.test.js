const assert = require('assert');
const app = require('../../src/app');

describe('\'docUpload\' service', () => {
  it('registered the service', () => {
    const service = app.service('doc-upload');

    assert.ok(service, 'Registered the service');
  });
});
