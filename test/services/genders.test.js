const assert = require('assert');
const app = require('../../src/app');

describe('\'genders\' service', () => {
  it('registered the service', () => {
    const service = app.service('genders');

    assert.ok(service, 'Registered the service');
  });
});
