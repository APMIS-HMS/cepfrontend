const assert = require('assert');
const app = require('../../src/app');

describe('\'admit-patient\' service', () => {
  it('registered the service', () => {
    const service = app.service('admit-patients');

    assert.ok(service, 'Registered the service');
  });
});
