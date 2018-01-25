/* eslint-disable no-unused-vars */
const walletModel = require('../../custom-models/wallet-model');
const walletTransModel = require('../../custom-models/wallet-transaction-model');
var Client = require('node-rest-client').Client;
const logger = require('winston');
const console = require('console');


class Service {
  constructor(options) {
    this.options = options || {};
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

  create(data, params) {
    //console.log('----------Data---------');
    //console.log('Entry');
    //console.log('----------Data---------');
    const facilityService = this.app.service('facilities');
    const employeeService = this.app.service('employees');
    const peopleService = this.app.service('people');
    const paymentService = this.app.service('payments');
    //console.log('----------Data---------');
    //console.log(data);
    console.log('----------Params---------');
    console.log(params);
    
    return new Promise(function (resolve, reject) {
      //******* Check if user initiating payment is the loggedon user */
      console.log('----------Inside---------');
      
      if (data.auth !== undefined) {
        console.log('----------define---------');
        peopleService.find({auth_access:data.auth}).then(person => {
          console.log('----------Person---------');
          console.log(person);
          if (person.email !== undefined) {
            //****** Check for the payment platform known as payment method/type */
            if (data.paymentMethod !== undefined) {
              var paymentPayload = {
                personId: person._id,
                reference: data.ref,
                paidBy: person._id,
                amountPaid: data.amount,
                paymentType: data.paymentMethod
              };
              if (data.paymentMethod === 'Flutterwave') {
                //*****Save Payment in database */
                paymentService.create(paymentPayload).then(payment => {
                  var url = process.env.FLUTTERWAVE_VERIFICATION_URL;
                  var client = new Client();
                  var args = {
                    data: {
                      'SECKEY': process.env.FLUTTERWAVE_SECRET_KEY, //use the secret key from the paybutton generated on the rave dashboard
                      'flw_ref': payment.reference, //use the reference of the payment from the rave checkout after payment
                      'normalize': 1
                    },
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  };
                  client.post(url, args, function (data, response) {
                    if (data.status === 'success') {
                      payment.isActive = true;
                      payment.paymentResponse = data;
                      // Update payment record.
                      paymentService.update(payment._id, payment).then(updatedPayment => {

                        peopleService.get(data.destinationId, {}).then(person => {
                          // Update person wallet.
                          let param = {
                            transactionType: 'Cr',
                            wallet: person.wallet
                          };
                          person.balance = parseFloat(person.wallet.balance) + parseFloat(data.amount);
                          person.ledgerBalance = parseFloat(person.ledgerBalance) + parseFloat(data.amount);
                          peopleService.update(person._id, person).then(personUpdate => {
                            resolve(personUpdate);
                          }).catch(err => {
                            reject(err);
                          });
                        });
                      });
                    }

                  });
                });
              } else if (data.paymentMethod === 'Paystack') {
                paymentService.create(paymentPayload).then(payment => {
                  let url = process.env.PAYSTACK_VERIFICATION_URL + data.ref.trxref;
                  var client = new Client();
                  var args = {
                    headers: {
                      Authorization: 'Bearer' + process.env.PAYSTACK_SECRET_KEY
                    }
                  };
                  client.post(url, args, function (data, response) {
                    if (data.status === 'success') {
                      payment.isActive = true;
                      payment.paymentResponse = data;
                      // Update payment record.
                      paymentService.update(payment._id, payment).then(updatedPayment => {

                        peopleService.get(data.destinationId, {}).then(person => {
                          // Update person wallet.
                          let param = {
                            transactionType: 'Cr',
                            wallet: person.wallet
                          };
                          person.balance = parseFloat(person.wallet.balance) + parseFloat(data.amount);
                          person.ledgerBalance = parseFloat(person.ledgerBalance) + parseFloat(data.amount);
                          peopleService.update(person._id, person).then(personUpdate => {
                            resolve(personUpdate);
                          }).catch(err => {
                            reject(err);
                          });
                        });
                      });
                    }

                  });
                });
              }else{
                reject(data.message);
              }
            }
          }
        });
      }
    });
  }


  setup(app) {
    this.app = app;
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
