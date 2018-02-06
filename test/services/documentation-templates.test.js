const assert = require('assert');
const app = require('../../src/app');

describe('\'documentation-templates\' service', () => {
  it('registered the service', () => {
    const service = app.service('documentation-templates');

    assert.ok(service, 'Registered the service');
  });
});
