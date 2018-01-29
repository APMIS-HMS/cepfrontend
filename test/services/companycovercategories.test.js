const assert = require('assert');
const app = require('../../src/app');

describe('\'companycovercategories\' service', () => {
  it('registered the service', () => {
    const service = app.service('companycovercategories');

    assert.ok(service, 'Registered the service');
  });
});
