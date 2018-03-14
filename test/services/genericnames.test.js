const assert = require('assert');
const app = require('../../src/app');

describe('\'genericnames\' service', () => {
  it('registered the service', () => {
    const service = app.service('genericnames');

    assert.ok(service, 'Registered the service');
  });
});
