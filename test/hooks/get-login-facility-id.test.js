const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const getLoginFacilityId = require('../../src/hooks/get-login-facility-id');

describe('\'get_login_facilityId\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      get(id) {
        return Promise.resolve({ id });
      }
    });

    app.service('dummy').hooks({
      before: getLoginFacilityId()
    });
  });

  it('runs the hook', () => {
    return app.service('dummy').get('test').then(result => {
      assert.deepEqual(result, { id: 'test' });
    });
  });
});
