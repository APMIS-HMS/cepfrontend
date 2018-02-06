var assert = require('chai').assert;
const app = require('../../src/app');
// const logger = require('winston');

describe('\'patients\' service', () => {
  it('registered the service', () => {
    const service = app.service('patients');
    assert.ok(service, 'Registered the service');
  });

  it('run create patient module', () => {
    const service = app.service('patients');
    service.create({}).then(facilityModule => {
      assert.isNotOk(facilityModule._id);
      // assert.strictEqual(facilityModule.name, 'Medical Records');
    }, error => {
      assert.ifError(error);
    });

  });
});
