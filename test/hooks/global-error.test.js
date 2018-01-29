const assert = require('assert');
const globalError = require('../../src/hooks/global-error');

describe('\'global-error\' hook', () => {
  it('runs the hook', () => {
    // A mock hook object
    const mock = {};
    // Initialize our hook with no options
    const hook = globalError();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
    },error =>{
      assert.ifError(error);
    });
  });
});
