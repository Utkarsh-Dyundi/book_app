import mongoose, { Schema, Document } from 'mongoose';

export interface IEventRegistration extends Document {
userID: mongoose.Types.ObjectId;
eventID: mongoose.Types.ObjectId;
collegeNameOfTheOrganiser?: string;
totalAmount?: number;
updated?: Date;
created?: Date;
paymentMode?: string;
paymentSuccess?: string;
completed?: boolean;
userName?: string;
}

const eventRegistrationSchema: Schema = new mongoose.Schema({
userID: {
type: Schema.Types.ObjectId,
ref: 'User'
},
eventID: {
type: Schema.Types.ObjectId,
ref: 'Event'
},
collegeNameOfTheOrganiser:{
type: String
},
totalAmount: {
type: Number,
default: 0
},
updated: Date,
created: {
type: Date,
default: Date.now
},
paymentMode: {
type: String
},
paymentSuccess: {
type: String
},
completed: {
type: Boolean,
default: false
},
userName: {
type: String,
maxlength: 50
}
});

const EventReg = mongoose.model<IEventRegistration>('Order', eventRegistrationSchema);

export default EventReg;