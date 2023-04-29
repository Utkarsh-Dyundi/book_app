import { Document, Model, Schema, model } from 'mongoose';

interface IReview extends Document {
  writer: Schema.Types.ObjectId;
  restaurantID: Schema.Types.ObjectId;
  heading?: string;
  comment: string;
  rating: number;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface IReviewModel extends Model<IReview> {}

const reviewSchema = new Schema(
  {
    writer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    restaurantID: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
    },
    heading: {
      type: String,
    },
    comment: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Review: IReviewModel = model<IReview, IReviewModel>('Review', reviewSchema);

export { Review };
export type { IReview };
