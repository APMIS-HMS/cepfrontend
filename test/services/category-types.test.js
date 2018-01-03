const assert = require('assert');
const app = require('../../src/app');

describe('\'categoryTypes\' service', () => {
  it('registered the service', () => {
    const service = app.service('category-types');

    assert.ok(service, 'Registered the service');
  });
});
