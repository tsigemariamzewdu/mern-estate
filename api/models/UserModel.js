import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Removes any leading or trailing spaces
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Convert email to lowercase to avoid case-sensitive issues
      match: [/\S+@\S+\.\S+/, 'Please use a valid email address'], // Email format validation
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
  },
  { timestamps: true }
);

// Handling duplicate key errors for unique fields (username and email)
userSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Username or Email already exists.'));
  } else {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

export default User;
