const assert = require('assert');
const app = require('../../src/app');

describe('\'people\' service', () => {
  it('registered the service', () => {
    const service = app.service('people');
    assert.ok(service, 'Registered the service');

    describe('create person object and validate it', () => {
      const service = app.service('people');
      it('create person', () => {
        service.create({
          firstName: 'ade',
          lastName: 'olu',
          title:'Mr',
          apmisId:'0193948',
          gender:'Male',
          phoneNumber:'080939343'

        }).then((person) => {
          assert.ok(person._id, 'person created');
        }).catch(error=>{
          assert.fail(error);
        });
       
      });
    });
  });


});
