// immunizationAppointment-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const immunizationAppointment = new Schema({
        appointmentDate: { type: Date, 'default': Date.now , required: true },
        status: { type: String, 'default': 'valid', required: true }, // This could either be valid or notValid
        //isDue: { type: Boolean, 'default': false, required: false },
        isPast: { type: Boolean, 'default': false, required: false },
        isFuture: { type: Boolean, 'default': true, required: false },
        completed:{type:Boolean, 'default':false, required:false},
        appointmentId:{type: Schema.Types.ObjectId, required:true}
    }, {
        timestamps: true
    });

    return mongooseClient.model('immunizationAppointment', immunizationAppointment);
};
