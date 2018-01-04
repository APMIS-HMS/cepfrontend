const assert = require('assert');
const app = require('../../src/app');

describe('\'inpatientWaitingLists\' service', () => {
  it('registered the service', () => {
    const service = app.service('inpatient-waiting-lists');

    assert.ok(service, 'Registered the service');
  });
});
