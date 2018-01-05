const assert = require('assert');
const app = require('../../src/app');

describe('\'presentation\' service', () => {
  it('registered the service', () => {
    const service = app.service('presentation');

    assert.ok(service, 'Registered the service');
  });
});
