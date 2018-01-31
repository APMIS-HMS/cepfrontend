const assert = require('assert');
const app = require('../../src/app');

describe('\'schedule-types\' service', () => {
  it('registered the service', () => {
    const service = app.service('schedule-types');

    assert.ok(service, 'Registered the service');
  });
});
