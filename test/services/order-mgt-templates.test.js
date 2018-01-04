const assert = require('assert');
const app = require('../../src/app');

describe('\'orderMgtTemplates\' service', () => {
  it('registered the service', () => {
    const service = app.service('order-mgt-templates');

    assert.ok(service, 'Registered the service');
  });
});
