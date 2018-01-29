// const assert = require('assert');
var assert = require('chai').assert;
const app = require('../../src/app');

describe('\'facility-modules\' service', () => {
  it('run create facility module', () => {
    const service = app.service('facility-modules');
    service.create({name: 'Medical Records'}).then(facilityModule =>{
      assert.ok(facilityModule._id);
      assert.strictEqual(facilityModule.name, 'Medical Records');
    });
   
  });
});
