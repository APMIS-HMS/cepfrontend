const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const sendFacilityOtp = require('../../src/hooks/send-facility-otp');

describe('\'sendFacilityOtp\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      get(id) {
        return Promise.resolve({ id });
      }
    });

    app.service('dummy').hooks({
      after: sendFacilityOtp()
    });
  });

  it('runs the hook', () => {
    return app.service('dummy').get('test').then(result => {
      assert.deepEqual(result, { id: 'test' });
    });
  });
});
