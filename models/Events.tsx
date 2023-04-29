import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEvent extends Document {
description: string;
name: string;
user: Schema.Types.ObjectId;
CollegeID: Schema.Types.ObjectId;
entryFees: number;
eventType: string;
participationType: string;
totalNumberOfEntryAllowed?: number;
priceDetails?: string;
images?: Array<string>;
}

interface IEventModel extends Model<IEvent> {}

const eventSchema: Schema = new mongoose.Schema({
description: {
type: String,
},
name: {
type: String,
},
user: {
type: Schema.Types.ObjectId,
ref: 'User',
},
CollegeID: {
type: Schema.Types.ObjectId,
ref: 'College',
},
entryFees: {
type: Number,
required: true,
},
eventType: {
type: String,
required: true,
},
participationType: {
type: String,
required: true,
},
totalNumberOfEntryAllowed: {
type: Number,
default: 100,
},
priceDetails: {
type: String,
},
images: {
type: Array,
default: [],
},
});

export const Event: IEventModel = mongoose.model<IEvent, IEventModel>('college', eventSchema);