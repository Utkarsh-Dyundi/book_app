import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import moment from 'moment';
const saltRounds = 10;
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  lastname: string;
  role: number;
  isVerified: boolean;
  dateOfBirth?: string;
  gender?: string;
  token?: string;
  tokenExp?: number;
  eventHistory?: any[];
  contactNo?: string;
  activeEvents?: any[];

  comparePassword: (plainPassword: string, cb: (err: Error | null, isMatch?: boolean) => void) => void;
  generateToken: (cb: (err: Error | null, user?: IUser) => void) => void;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  dateOfBirth: {
    type: String,
  },
  gender: {
    type: String,
  },
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
  eventHistory: {
    type: [Schema.Types.ObjectId],
    ref: 'Event',
  },
  activeEvents: {
    type: [Schema.Types.ObjectId],
    ref: 'Event',
  },
  contactNo: {
    type: String,
    maxlength: 20,
  },
});

userSchema.pre<IUser>('save', function (next) {
  const user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword: string, cb: (err: Error | null, isMatch?: boolean) => void) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb: (err: Error | null, user?: IUser) => void) {
  const user = this;
  const token = jwt.sign(user._id.toHexString(), 'secret');
  const oneHour = moment().add(1, 'hour').valueOf();

  user.tokenExp = oneHour;
  user.token = token;
  user.save(function (err: Error | null, user: IUser | undefined) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token: string, cb: (err: Error | null, user?: IUser) => void) {
  const user = this;

  jwt.verify(token, 'secret', function (err, decode) {
    user.findOne({ _id: decode, token: token }, function (err: Error | null, user: IUser | undefined) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export { User };
