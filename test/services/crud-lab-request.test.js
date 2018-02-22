const assert = require('assert');
const app = require('../../src/app');

describe('\'crud-lab-request\' service', () => {
  it('registered the service', () => {
    const service = app.service('crud-lab-request');

    assert.ok(service, 'Registered the service');
  });
});
