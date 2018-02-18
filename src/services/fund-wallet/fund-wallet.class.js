/* eslint-disable no-unused-vars */
'use strict';
const walletModel = require('../../custom-models/wallet-model');
const walletTransModel = require('../../custom-models/wallet-transaction-model');
const Client = require('node-rest-client').Client;
const request = require('request');
const requestPromise = require('request-promise');
const logger = require('winston');
const rxjs = require('rxjs');


class FundWalletService {
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

    async create(data, params) {

        const facilityService = this.app.service('facilities');
        const employeeService = this.app.service('employees');
        const peopleService = this.app.service('people');
        const paymentService = this.app.service('payments');

        // return new Promise(function(resolve, reject) {
        const accessToken = params.accessToken; /* Not required */
        if (accessToken !== undefined) {
            const ref = data.ref; /* Not required. This is for e-payment */
            const payment = data.payment;
            const paymentType = payment.type; /* Required. This is either "Cash*, "Cheque", "e-Payment" */
            const paymentRoute = payment.route; /* Not required. This is either "Flutterwave", "Paystack" */
            const amount = ref.amount; /* Required */
            const facilityId = data.facilityId; /* Not required. This is if someone is funding the wallet on behalf of the facility */
            const entity = data.entity; /* Required. This is the entity making the transaction. Could either be "Person" or "Facility" */
            const loggedPersonId = params.user.personId;
            const destinationId = (data.destinationId !== undefined) ? data.destinationId : params.user.personId;
            if (payment !== undefined) {
                const paymentPayload = {
                    facilityId: (entity === 'Facility') ? facilityId : undefined,
                    personId: (entity === 'Person') ? destinationId : undefined,
                    entity: entity,
                    reference: ref,
                    paidBy: loggedPersonId,
                    amount: amount,
                    paymentType: paymentType,
                    paymentRoute: paymentRoute,
                };

                if (paymentRoute !== undefined && paymentRoute.toLowerCase() === 'flutterwave') {
                    //*****Save Payment in database */
                    const paymentRes = await paymentService.create(paymentPayload);
                    const url = process.env.FLUTTERWAVE_VERIFICATION_URL;
                    const verifyResponse = await this.verifyPayment(url, process.env.FLUTTERWAVE_SECRET_KEY, paymentRes.reference.flwRef);
                    const parsedResponse = JSON.parse(verifyResponse);
                    if (parsedResponse.status === 'success') {
                        paymentRes.isActive = true;
                        paymentRes.paymentResponse = parsedResponse.data;
                        // Update payment record.
                        const updatedPayment = await paymentService.update(paymentRes._id, paymentRes);

                        if (entity !== undefined && entity.toLowerCase() === 'person') {
                            const person = await peopleService.get(destinationId);
                            const userWallet = person.wallet;
                            const cParam = {
                                amount: amount,
                                paidBy: loggedPersonId,
                                sourceId: loggedPersonId,
                                sourceType: entity,
                                transactionType: 'Cr',
                                transactionMedium: paymentType,
                                destinationId: destinationId,
                                destinationType: entity,
                                description: 'Funded wallet via e-payment',
                                transactionStatus: 'Completed',
                            };
                            person.wallet = transaction(userWallet, cParam);

                            const personUpdate = await peopleService.update(person._id, person, {});

                            return personUpdate;
                        } else if (entity !== undefined && entity.toLowerCase() === 'facility') {
                            const facility = await facilityService.get(facilityId);
                            const userWallet = facility.wallet;
                            const cParam = {
                                amount: amount,
                                paidBy: loggedPersonId,
                                sourceId: facilityId,
                                sourceType: entity,
                                transactionType: 'Cr',
                                transactionMedium: paymentType,
                                destinationId: facilityId,
                                destinationType: entity,
                                description: 'Funded wallet via e-payment',
                                transactionStatus: 'Completed',
                            };
                            facility.wallet = transaction(userWallet, cParam);

                            const facilityUpdate = await facilityService.update(facility._id, facility);
                            return facilityUpdate;
                        }
                    } else {
                        return new Error('There was an error while verifying this payment');
                    }
                } else if (paymentRoute !== undefined && paymentRoute.toLowerCase() === 'paystack') {
                    paymentService.create(paymentPayload).then(payment => {
                        let url = process.env.PAYSTACK_VERIFICATION_URL + data.ref.trxref;
                        var client = new Client();
                        var args = {
                            headers: {
                                Authorization: 'Bearer' + process.env.PAYSTACK_SECRET_KEY
                            }
                        };
                        client.post(url, args, function(data, response) {
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
                                            return personUpdate;
                                            // resolve(personUpdate);
                                        }).catch(err => {
                                            // reject(err);
                                        });
                                    });
                                });
                            }

                        });
                    }).catch(err => {
                        // reject(err);
                    });
                } else {
                    return false;
                }
            } else {
                const data = {
                    msg: 'payment parameter is not defined',
                    status: false
                };
                return data;
            }
        } else {
            const data = {
                msg: 'Sorry! But you can not perform this transaction.',
                status: false
            };
            return data;
        }
        // });
    }

    verifyPayment(url, secKey, ref) {
        const options = {
            method: 'POST',
            uri: url,
            body: JSON.stringify({
                'SECKEY': secKey, //use the secret key from the paybutton generated on the rave dashboard
                'flw_ref': ref, //use the reference of the payment from the rave checkout after payment
                'normalize': 1
            }),
            headers: {
                'content-type': 'application/json'
            },
        };
        return requestPromise(options);
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

function transaction(wallet, param) {
    const prevAmount = wallet.balance;
    const ledgerBalance = wallet.ledgerBalance;
    // Update person wallet.
    let transaction = {
        transactionType: param.transactionType,
        transactionMedium: param.transactionMedium,
        transactionStatus: param.transactionStatus,
        sourceId: param.sourceId,
        sourceType: param.sourceType,
        amount: param.amount,
        refCode: generateOtp(),
        description: param.description,
        destinationId: param.destinationId,
        destinationType: param.destinationType,
        paidBy: param.paidBy
    };

    wallet.transactions.push(transaction);
    wallet.balance = parseFloat(wallet.balance) + parseFloat(param.amount);
    wallet.ledgerBalance = parseFloat(wallet.ledgerBalance) + parseFloat(param.amount);

    const lastTxIndex = wallet.transactions.findIndex(x => x.refCode === transaction.refCode);
    if (lastTxIndex > -1) {
        let lastTx = wallet.transactions[lastTxIndex];
        lastTx.balance = wallet.balance;
        lastTx.ledgerBalance = wallet.ledgerBalance;
        wallet.transactions[lastTxIndex] = lastTx;
    }
    return wallet;
}

function generateOtp() {
    var otp = '';
    var possible = '0123456789';
    for (var i = 0; i <= 5; i++) {
        otp += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return otp;
}

module.exports = function(options) {
    return new FundWalletService(options);
};

module.exports.Service = FundWalletService;