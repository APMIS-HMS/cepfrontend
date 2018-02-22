const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const purchaseOrderId = require('../../src/hooks/purchase-order-id');

describe('\'purchaseOrderId\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      get(id) {
        return Promise.resolve({ id });
      }
    });

    app.service('dummy').hooks({
      before: purchaseOrderId()
    });
  });

  it('runs the hook', () => {
    return app.service('dummy').get('test').then(result => {
      assert.deepEqual(result, { id: 'test' });
    });
  });
});
