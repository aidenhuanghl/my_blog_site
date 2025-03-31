import mongoose, { Schema, models } from 'mongoose';

export interface IComment extends mongoose.Document {
  content: string;
  post: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Post reference is required'],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author reference is required'],
    },
  },
  {
    timestamps: true,
  }
);

// If the Comment model already exists, use it. Otherwise, create a new model
const Comment = models.Comment || mongoose.model<IComment>('Comment', commentSchema);

export default Comment; 