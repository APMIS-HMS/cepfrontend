const assert = require('assert');
const app = require('../../src/app');

describe('\'bill-creators\' service', () => {
  it('registered the service', () => {
    const service = app.service('bill-creators');

    assert.ok(service, 'Registered the service');
  });
});
