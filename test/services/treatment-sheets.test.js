const assert = require('assert');
const app = require('../../src/app');

describe('\'treatment-sheets\' service', () => {
  it('registered the service', () => {
    const service = app.service('treatment-sheets');

    assert.ok(service, 'Registered the service');
  });
});
