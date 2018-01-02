const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const peopleApmisId = require('../../src/hooks/people-apmis-id');

describe('\'peopleApmisId\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      get(id) {
        return Promise.resolve({ id });
      }
    });

    app.service('dummy').hooks({
      before: peopleApmisId()
    });
  });

  it('runs the hook', () => {
    return app.service('dummy').get('test').then(result => {
      assert.deepEqual(result, { id: 'test' });
    });
  });
});
