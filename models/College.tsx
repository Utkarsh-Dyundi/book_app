import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import moment from 'moment';

const saltRounds = 10;

// geoSchema
interface GeoSchema extends Document {
  type: string;
  coordinates: number[];
}

const geoSchema: Schema = new mongoose.Schema({
  type: {
    type: String,
    default: 'Point',
  },
  coordinates: {
    type: [Number],
    index: '2dsphere',
  },
});

interface ICollege extends Document {
  parentID: string;
  collegeName: string;
  pincode: number;
  address: string;
  description: string;
  images: string[];
  category: number;
  rating: number;
  status: boolean;
  events: number;
  eventsHistory: string[];
  reviews: string[];
  dist: {
    calculated: number;
  };
  contactNo: string;
  geometry: GeoSchema;
  staffName: string;
  email: string;
  password: string;
  lastname: string;
  tokenExp: number;
  isVerified: boolean;
  token: string;
  totalScore: number;
  totalReviews: number;
}
interface ICollegeModel extends Model<ICollege> {}

const collegeSchema: Schema = new mongoose.Schema(
  {
    parentID: {
      type: String,
      default: 'first',
    },
    collegeName: {
      type: String,
      maxlength: 50,
    },
    pincode: {
      type: Number,
    },
    address: {
      type: String,
      maxlength: 50,
    },
    description: {
      type: String,
      maxlength: 50,
    },
    images: {
      type: Array,
      default: [],
    },
    category: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4,
    },
    status: {
      type: Boolean,
      default: false,
    },
    events: {
      type: Number,
      default: 0,
    },
    eventsHistory: {
      type: Array,
      default: [],
    },
    reviews: {
      type: Array,
      default: [],
    },
    dist: {
      calculated: {
        type: Number,
      },
    },
    contactNo: {
      type: String,
      maxlength: 20,
    },
    geometry: geoSchema,
    staffName: {
      type: String,
      maxlength: 50,
    },
    email: {
      type: String,
      trim: true,
      unique: 1,
    },
    password: {
      type: String,
      minlength: 5,
    },
    lastname: {
      type: String,
      maxlength: 50,
    },
    tokenExp: {
      type: Number,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

collegeSchema.pre<ICollege>('save', function (next) {
  const college = this;
  if (college.isModified('password')) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(college.password, salt, function (err, hash) {
        if (err) return next(err);
        college.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

collegeSchema.pre<ICollege>('save', function (next) {
    if (this.parentID === "first") {
      this.parentID = this.get('_id');
    }
    next();
  });
  
  collegeSchema.methods.comparePassword = function (plainPassword: string, cb: (err: any, isMatch: any) => void) {
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
      if (err) return cb(err.message,College);
      cb(null, isMatch);
    });
  };
  
  collegeSchema.methods.generateToken = function (cb: (err: any, college: ICollege) => void) {
    const college = this;
    const token = jwt.sign(college._id.toHexString(), 'secret');
    const oneHour = moment().add(1, 'hour').valueOf();
    college.tokenExp = oneHour;
    college.token = token;
    college.save(function (err: any, college: ICollege) {
      if (err) return cb(err,college);
      cb(null, college);
    });
  };
  
  collegeSchema.statics.findByToken = function (token: string, cb: (err: any, college: ICollege) => void) {
    const college = this;
    jwt.verify(token, 'secret', function (err, decode) {
      college.findOne({ "_id": decode, "token": token }, function (err: any, college: ICollege) {
        if (err) return cb(err,college);
        cb(null, college);
      });
    });
  };
  
  export const College: ICollegeModel = mongoose.model<ICollege, ICollegeModel>('college', collegeSchema);
