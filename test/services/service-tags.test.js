const assert = require('assert');
const app = require('../../src/app');

describe('\'serviceTags\' service', () => {
  it('registered the service', () => {
    const service = app.service('service-tags');

    assert.ok(service, 'Registered the service');
  });
});
