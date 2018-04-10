/* eslint-disable no-unused-vars */
' use strict ';
const walletModel = require('../../custom-models/wallet-model');
const walletTransModel = require('../../custom-models/wallet-transaction-model');
const Client = require('node-rest-client').Client;
const request = require('request');
const requestPromise = require('request-promise');
const logger = require('winston');
const rxjs = require('rxjs');
const jsend = require('jsend');


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
        const cashPaymentService = this.app.service('cash-payment');

        const accessToken = params.accessToken; /* Not required */

        if (accessToken !== undefined && data.paymentMethod === undefined) {
            const ref = data.ref; /* Not required. This is for e-payment */
            const payment = data.payment;
            const paymentType = payment.type; /* Required. This is either "Cash*, "Cheque", "e-Payment" */
            const paymentRoute = payment.route; /* Not required. This is either "Flutterwave", "Paystack" */
            const amount = data.amount; /* Required */
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

                            const personUpdate = await peopleService.update(person._id, person, { query: { facilityId: params.query.facilityId } });

                            return jsend.success(personUpdate);
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
                            return jsend.success(facilityUpdate);
                        }
                    } else {
                        return new Error('There was an error while verifying this payment');
                    }
                } else if (paymentRoute !== undefined && paymentRoute.toLowerCase() === 'paystack') {
                    const paymentRes = await paymentService.create(paymentPayload);
                    if (paymentRes !== undefined) {
                        let url = process.env.PAYSTACK_VERIFICATION_URL + data.ref.trxref;
                        let data2 = await this.verifyPayStackPayment(url);
                        let payload = JSON.parse(data2);
                        if (payload.status && payload.data.status === 'success') {
                            paymentRes.isActive = true;
                            paymentRes.paymentResponse = data2;
                            let updatedPayment = await paymentService.update(paymentRes._id, paymentRes);

                            if (updatedPayment !== undefined) {
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
                                    try {
                                        const personUpdate = await peopleService.update(person._id, person, { query: { facilityId: params.query.facilityId } });

                                        return jsend.success(personUpdate);
                                    } catch (error) {
                                        return jsend.error('There was a problem trying to create prescription');
                                    }



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
                                    return jsend.success(facilityUpdate);
                                }

                            }

                        }
                    }
                }
            } else {
                const data = {
                    msg: 'payment parameter is not defined',
                    status: false
                };
                return data;
            }
        } else if (accessToken !== undefined && (data.paymentMethod !== undefined && data.paymentMethod.toLowerCase() === 'cash')) {
            const person = await peopleService.get(data.destinationId);
            const userWallet = person.wallet;
            const cParam = {
                amount: data.amount,
                paidBy: data.paidBy,
                sourceId: data.sourceId,
                sourceType: 'Facility',
                transactionType: 'Cr',
                transactionMedium: 'cash',
                destinationId: data.destinationId,
                destinationType: 'Person',
                description: 'Funded wallet via cash payment',
                transactionStatus: 'Completed',
            };
            person.wallet = transaction(userWallet, cParam, 'person');


            const facility = await facilityService.get(data.sourceId);
            const facilityWallet = facility.wallet;
            const cParamF = {
                amount: data.amount,
                paidBy: data.paidBy,
                sourceId: data.sourceId,
                sourceType: 'Facility',
                transactionType: 'Dr',
                transactionMedium: 'cash',
                destinationId: data.destinationId,
                destinationType: 'Person',
                description: 'Debit wallet via patient wallet transfer',
                transactionStatus: 'Completed',
            };
            facility.wallet = transaction(facilityWallet, cParamF, 'facility');




            // } else if (entity !== undefined && entity.toLowerCase() === 'facility') {
            //     const facility = await facilityService.get(facilityId);
            //     const userWallet = facility.wallet;
            //     const cParam = {
            //         amount: amount,
            //         paidBy: loggedPersonId,
            //         sourceId: facilityId,
            //         sourceType: entity,
            //         transactionType: 'Cr',
            //         transactionMedium: paymentType,
            //         destinationId: facilityId,
            //         destinationType: entity,
            //         description: 'Funded wallet via e-payment',
            //         transactionStatus: 'Completed',
            //     };
            //     facility.wallet = transaction(userWallet, cParam);

            //     const facilityUpdate = await facilityService.update(facility._id, facility);
            //     return jsend.success(facilityUpdate);
            // }
            // const cashPayment = await cashPaymentService.create(data, params);
            // console.log('********Cash Payment from fundwallet**********');
            // console.log(cashPayment);

            let personUpdate = await peopleService.update(person._id, person, { query: { facilityId: params.query.facilityId } });
            //const personUpdate = await peopleService.update(person._id, person);
            const facilityUpdate = await facilityService.patch(facility._id, {
                wallet: facility.wallet
            });
            return jsend.success({ facility: facilityUpdate, person: personUpdate });
        } else {
            const data = {
                msg: 'Sorry! But you can not perform this transaction.',
                status: false
            };
            return data;
        }
        // });
    }

    verifyPayStackPayment(url) {
        const options = {
            method: 'GET',
            uri: url,
            headers: {
                Authorization: 'Bearer ' + process.env.PAYSTACK_SECRET_KEY
            }
        };
        return requestPromise(options);
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

function transaction(wallet, param, type) {
    if (wallet == null) {
        wallet = { balance: 0, ledgerBalance: 0, transactions: [] };
    }
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
    if (param.transactionMedium === 'cash') {
        if (type === 'person') {
            wallet.balance = parseFloat(wallet.balance) + parseFloat(param.amount);
            wallet.ledgerBalance = parseFloat(wallet.ledgerBalance) + parseFloat(param.amount);
        } else {
            wallet.balance = parseFloat(wallet.balance) - parseFloat(param.amount);
            wallet.ledgerBalance = parseFloat(wallet.ledgerBalance) - parseFloat(param.amount);
        }

    } else {
        wallet.balance = parseFloat(wallet.balance) + parseFloat(param.amount);
        wallet.ledgerBalance = parseFloat(wallet.ledgerBalance) + parseFloat(param.amount);
    }


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