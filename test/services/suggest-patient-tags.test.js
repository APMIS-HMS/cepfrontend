const assert = require('assert');
const app = require('../../src/app');

describe('\'suggest-patient-tags\' service', () => {
  it('registered the service', () => {
    const service = app.service('suggest-patient-tags');

    assert.ok(service, 'Registered the service');
  });
});
