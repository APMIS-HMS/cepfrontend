const assert = require('assert');
const app = require('../../src/app');

describe('\'diagnosises\' service', () => {
  it('registered the service', () => {
    const service = app.service('diagnosises');

    assert.ok(service, 'Registered the service');
  });
});
