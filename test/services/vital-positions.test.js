const assert = require('assert');
const app = require('../../src/app');

describe('\'vitalPositions\' service', () => {
  it('registered the service', () => {
    const service = app.service('vital-positions');

    assert.ok(service, 'Registered the service');
  });
});
