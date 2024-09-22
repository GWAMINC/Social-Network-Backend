import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
    },
    isFriend: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isFollowed: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    bookmarkedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    }],
    notInterestedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    }],
    profile: {
      bio: {
        type: String,
        default: "",
      },
      profilePhoto: {
        type: String,
        default: "",
      },
      birthDate: {
        type: Date,
      },
      gender: {
        type: String,
        default: "",
        enum: ["Nam", "Nữ", ""],
      },
      relationship: [{ type: String, default: "" }],
      address: {
        type: String,
        default: "",
      },
      job: {
        type: String,
        default: "",
      },
      education: {
        type: String,
        default: "",
      },
      city: {
        type: String,
        default: "",
      },
      PersonalWebsite: [{ type: String, default: "" }],
      hobby: [{ type: String, default: "" }],
    },
  },
  { timestamps: true }
);
export const User = mongoose.model("User", userSchema);
