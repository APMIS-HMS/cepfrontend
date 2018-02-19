/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  find(params) {
    return Promise.resolve([]);
  }

  get(id, params) {
    return Promise.resolve({
      id,
      text: `A new message with ID: ${id}!`
    });
  }

  async create(data, params) {
    const inventoriesService = this.app.service('inventories');
    const productsService = this.app.service('products');
    let inventory = await inventoriesService.find({
      query: {
        facilityId: data.product.facilityId,
        productId: data.product._id
      }
    });
    if (inventory.data.length > 0) {
      return {};
      // let batches = data;
      // let inventoryModel = inventory.data[0];
      // let len = batches.batchItems.length - 1;
      // for (let index = len; index >= 0; index--) {
      //   inventoryModel.totalQuantity += batches.batchItems[index].quantity;
      //   inventoryModel.availableQuantity += batches.batchItems[index].quantity;
      //   inventoryModel.transactions.push(batches.batchItems[index]);
      // }
      // let updatedInventories = inventoriesService.patch(inventoryModel._id, {
      //   totalQuantity: inventoryModel.totalQuantity,
      //   availableQuantity: inventoryModel.availableQuantity,
      //   transactions: inventoryModel.transactions
      // });
      // let product = productsService.get(payload.productId);
      // if (product != null) {
      //   product.isInventory = true;
      //   let updatedProduct = productsService.update(product._id, {
      //     isInventory: product.isInventory
      //   });
      //   let res = {
      //     inventory: updatedInventories,
      //     product: updatedProduct
      //   }
      //   return res;
      // }
    } else {
      let batches = data;
      let inventoryModel = {};
      inventoryModel.facilityId = batches.product.facilityId;
      inventoryModel.storeId = batches.storeId;
      inventoryModel.serviceId = batches.product.serviceId;
      inventoryModel.categoryId = batches.product.categoryId;
      inventoryModel.facilityServiceId = batches.product.facilityServiceId;
      inventoryModel.productId = batches.product._id;
      inventoryModel.transactions = [];
      inventoryModel.totalQuantity = 0;
      inventoryModel.availableQuantity = 0;

      let len = batches.batchItems.length - 1;
      for (let index = len; index >= 0; index--) {
        if (index >= 0) {
          inventoryModel.totalQuantity += batches.batchItems[index].quantity;
          inventoryModel.availableQuantity += batches.batchItems[index].quantity;
          inventoryModel.transactions.push(batches.batchItems[index]);
        }
      }
      let inventory = await inventoriesService.create(inventoryModel);
      // let product = await productsService.get(batches.product._id);
      // console.log(5);
      // if (product != null) {
      //   product.isInventory = true;
      //   let updatedProduct = await productsService.patch(product._id, {
      //     isInventory: product.isInventory
      //   });

      // }
      let res = {
        inventory: inventory
        //product: updatedProduct
      };
      return res;
    }
  }

  update(id, data, params) {
    return Promise.resolve(data);
  }

  patch(id, data, params) {
    return Promise.resolve(data);
  }

  remove(id, params) {
    return Promise.resolve({
      id
    });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
