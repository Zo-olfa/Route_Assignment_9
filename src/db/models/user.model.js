import mongoose from "mongoose";
import { decryptPlainText } from "../../utils/crypto.util.js";

const UserSchema = new mongoose.Schema(
  {
    // • name (String, required)
    name: {
      type: String,
      required: [true, "Name property is required"],
      trim: true,
      lowercase: true,
    },
    // • email (String, Unique, required)
    email: {
      type: String,
      unique: [true, "Email already exists"],
      required: [true, "Email property is required"],
      trim: true,
      lowercase: true,
    },
    // • Password (String, required)
    password: {
      type: String,
      required: [true, "Password property is required"],
      trim: true,

      // setter to hash password before saving
      // set: function (value) {
      //   const isHex = /^[0-9a-f]{64}$/.test(value);
      //   if (!isHex) {
      //     return hashPlainText(value);
      //   }
      //   return value;
      // },
    },
    // • Phone (String, required)
    phone: {
      type: String,
      required: [true, "Phone property is required"],
      trim: true,

      // getter to decrypt phone before returning
      get: function (value) {
        const isValid = /^[A-Za-z0-9+/]+={0,2}$/.test(value);
        if (value && isValid && this.phoneIv) {
          return decryptPlainText(value, this.phoneIv);
        }
        return value;
      },
    },
    phoneIv: String,
    // • age (Number) (Must be between 18 and 60)
    age: {
      type: Number,
      min: [18, "Age must be greater than 18"],
      max: [60, "Age must be less than 60"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    methods: {
      toUserProfile: function () {
        return {
          id: this._id,
          name: this.name,
          email: this.email,
          phone: this.phone,
          age: this.age,
        };
      },
    },
  },
);

// 1. Hook for .save() (Document Middleware)
// UserSchema.pre("save", function () {
//   if (this.isModified("password")) {
//     this.password = hashPlainText(this.password);
//   }
//   if (this.isModified("phone")) {
//     const { plain, iv } = encryptPlainText(this.phone);
//     this.phone = plain;
//     this.phoneIv = iv;
//   }
// });

// 2. Hook for updates (Query Middleware)
// UserSchema.pre(["updateOne", "findByIdAndUpdate", "findOneAndUpdate"], function () {
//   const update = this.getUpdate();
//   const phone = update.phone || (update.$set && update.$set.phone);
//   if (phone) {
//     const { plain, iv } = encryptPlainText(phone);

//     if (update.phone) {
//       update.phone = plain;
//       update.phoneIv = iv;
//     } else if (update.$set) {
//       update.$set.phone = plain;
//       update.$set.phoneIv = iv;
//     }
//   }
// });

const UserModel = mongoose.model("Users", UserSchema);

export default UserModel;
