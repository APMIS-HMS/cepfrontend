// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async (context) => {
    console.log('Inv');
    console.log(context);
    const productService = context.app.service('product-reorder');
    console.log(context.app.service('patients'));
    let reorderIsh;
    try {
      reorderIsh = await productService.find({
        query: {
          facilityId: context.result.facilityId,
          storeId: context.result.storeId,
          productId: context.result.productId
        }
      })
    } catch(e) {
      console.log(e);
    }
    console.log('reorder: ', reorderIsh);
    return Promise.resolve(context);
  };
};
