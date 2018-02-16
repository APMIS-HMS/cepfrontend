const assert = require('assert');
const app = require('../../src/app');

describe('\'crud-lab-report\' service', () => {
  it('registered the service', () => {
    const service = app.service('crud-lab-report');

    assert.ok(service, 'Registered the service');
  });
});
