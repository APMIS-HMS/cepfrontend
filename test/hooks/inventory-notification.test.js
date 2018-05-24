const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const inventoryNotification = require('../../src/hooks/inventory-notification');

describe('\'inventory-notification\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      get(id) {
        return Promise.resolve({ id });
      }
    });

    app.service('dummy').hooks({
      
    });
  });

  it('runs the hook', () => {
    return app.service('dummy').get('test').then(result => {
      assert.deepEqual(result, { id: 'test' });
    });
  });
});
