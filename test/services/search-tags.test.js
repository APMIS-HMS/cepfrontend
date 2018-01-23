const assert = require('assert');
const app = require('../../src/app');

describe('\'searchTags\' service', () => {
  it('registered the service', () => {
    const service = app.service('search-tags');

    assert.ok(service, 'Registered the service');
  });
});
