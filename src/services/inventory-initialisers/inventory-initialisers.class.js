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
    const orgService = this.app.service('organisation-services');
    let inventory = await inventoriesService.find({
      query: {
        facilityId: data.product.facilityId,
        productId: data.product.productObject.id
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
      let service = {};
      let index = null;
      let orgServiceValue = {};
      service.name = data.product.productObject.name;
      let awaitOrganService = await orgService.get(data.facilityServiceId);
      awaitOrganService.categories.forEach((item, i) => {
        if (item._id.toString() === data.categoryId.toString()) {
          item.services.push(service);
          index = i;
        }
      });
      const payResult = await orgService.patch(awaitOrganService._id, awaitOrganService);

      payResult.categories.forEach((itemi, i) => {
        if (itemi._id.toString() === data.categoryId.toString()) {
          itemi.services.forEach((items, s) => {
            if (index !== null) {
              if (index.toString() === s.toString()) {
                orgServiceValue.serviceId = items._id;
              }
            }
          });
        }
      });

      let batches = data;
      let inventoryModel = {};
      inventoryModel.facilityId = batches.product.facilityId;
      inventoryModel.storeId = batches.storeId;
      inventoryModel.serviceId = orgServiceValue.serviceId;
      inventoryModel.categoryId = data.categoryId;
      inventoryModel.facilityServiceId = data.facilityServiceId;
      inventoryModel.productId = batches.product.productObject.id;
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
      let res = {
        inventory: inventory
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
