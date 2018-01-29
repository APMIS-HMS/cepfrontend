const assert = require('assert');
const app = require('../../src/app');

describe('\'dispenseAssessment\' service', () => {
  it('registered the service', () => {
    const service = app.service('dispense-assessments');

    assert.ok(service, 'Registered the service');
  });
});
