const assert = require('assert');
const app = require('../../src/app');

describe('\'tagDictioneries\' service', () => {
  it('registered the service', () => {
    const service = app.service('tag-dictioneries');

    assert.ok(service, 'Registered the service');
  });
});
