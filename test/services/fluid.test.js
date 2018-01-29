const assert = require('assert');
const app = require('../../src/app');

describe('\'fluid\' service', () => {
  it('registered the service', () => {
    const service = app.service('fluid');

    assert.ok(service, 'Registered the service');
  });
});
