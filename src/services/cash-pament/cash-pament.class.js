/* eslint-disable no-unused-vars */
const jsend = require('jsend');
class Service {
    constructor (options) {
        this.options = options || {};
    }

    find (params) {
        return Promise.resolve([]);
    }

    get (id, params) {
        return Promise.resolve({
            id, text: `A new message with ID: ${id}!`
        });
    }

    create (data, params) {
        const facilityService = this.app.Service('facilities');
        const peopleService = this.app.Service('people');
        if (data.facilityId !== undefined && data.amount > 0) {
            const facilityId = data.facilityId; // required
            const personId = data.personId; // required
            const amount = data.amount; // required
            let wallet; 
            const facility = facilityService.find({query:{facilityId:data.facilityId}});
            if (facility !== undefined){
                const facilityBalance = facility.wallet.balance;
                if (facilityBalance > amount) {
                    console.log('facility balance = ');
                    console.log(facilityBalance);
                    if(personId !== undefined) {
                        console.log('Person Defined ');
                        const person = peopleService.find({query:{personId:personId}});
                        if (person !== undefined){
                            console.log('Person Found');
                            person.wallet.balance += amount;
                            facility.wallet.balance -= amount;
                            console.log('Person Wallet');
                            console.log(person.wallet.balance);
                            console.log('Facility new balance');
                            console.log(facility.wallet.balance);
                            // this.facilityService.patch(facilityId,{query:{wallet:facility.wallet}});
                            // this.peopleService.patch(personId,{query:{wallet:person.wallet}});

                            return jsend.success('Successful');
                        } else{
                            return jsend.error('Invalid ApmisId');
                        }
                    }else{
                        return jsend.error('Undefined reciever');
                    }
                } else{
                    return jsend.error('Facility Balance is too low for this transaction');
                }
                
            } else{
                return jsend.error('Facility is undefined!');
            }
        } else{
            return jsend.error('An error occured while trying to perform this transaction');
        }
    }

    update (id, data, params) {
        return Promise.resolve(data);
    }

    patch (id, data, params) {
        return Promise.resolve(data);
    }

    remove (id, params) {
        return Promise.resolve({ id });
    }

    setup(app) {
        this.app = app;
    }
}

module.exports = function (options) {
    return new Service(options);
};

module.exports.Service = Service;
