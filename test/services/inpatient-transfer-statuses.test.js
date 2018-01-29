const assert = require('assert');
const app = require('../../src/app');

describe('\'inpatientTransferStatuses\' service', () => {
  it('registered the service', () => {
    const service = app.service('inpatient-transfer-statuses');

    assert.ok(service, 'Registered the service');
  });
});
