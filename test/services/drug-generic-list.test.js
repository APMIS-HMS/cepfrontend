const assert = require('assert');
const app = require('../../src/app');

describe('\'drugGenericList\' service', () => {
  it('registered the service', () => {
    const service = app.service('drug-generic-list');

    assert.ok(service, 'Registered the service');
  });
});
