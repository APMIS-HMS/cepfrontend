const assert = require('assert');
const app = require('../../src/app');

describe('\'list-of-stores\' service', () => {
  it('registered the service', () => {
    const service = app.service('list-of-stores');

    assert.ok(service, 'Registered the service');
  });
});
