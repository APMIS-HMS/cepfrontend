const assert = require('assert');
const app = require('../../src/app');

describe('\'facilityOwnerships\' service', () => {
  it('registered the service', () => {
    app.service('facility-ownerships').create({ name: 'David' }).then(person => {
      assert.ok(person._id);
      assert.equal(person.name, 'David');
    });
  },err=>{
    assert.fail(err);
  });
});