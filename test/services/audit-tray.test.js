const assert = require('assert');
const app = require('../../src/app');

describe('\'audit_tray\' service', () => {
  it('registered the service', () => {
    const service = app.service('audit-tray');

    assert.ok(service, 'Registered the service');
  });
});
