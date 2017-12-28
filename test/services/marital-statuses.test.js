const assert = require('assert');
const app = require('../../src/app');

describe('\'maritalStatuses\' service', () => {
  it('registered the service', () => {
    const service = app.service('marital-statuses');

    assert.ok(service, 'Registered the service');
  });
});
