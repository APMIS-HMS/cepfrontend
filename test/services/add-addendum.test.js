const assert = require('assert');
const app = require('../../src/app');

describe('\'add-addendum\' service', () => {
  it('registered the service', () => {
    const service = app.service('add-addendum');

    assert.ok(service, 'Registered the service');
  });
});
