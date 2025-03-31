import mongoose, { Schema, models } from 'mongoose';

export interface IPost extends mongoose.Document {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  published: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  author: mongoose.Types.ObjectId;
}

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type: String,
      trim: true,
    },
    coverImage: {
      type: String,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    published: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to auto-generate excerpt if not provided
postSchema.pre('save', function (next) {
  if (!this.excerpt && this.content) {
    // Generate excerpt from content (first 150 characters)
    this.excerpt = this.content
      .replace(/(<([^>]+)>)/gi, '') // Remove HTML tags
      .slice(0, 150)
      .trim();
    
    // Add ellipsis if the excerpt is truncated
    if (this.content.length > 150) {
      this.excerpt += '...';
    }
  }
  
  // Set publishedAt date if the post is being published for the first time
  if (this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

// If the Post model already exists, use it. Otherwise, create a new model
const Post = models.Post || mongoose.model<IPost>('Post', postSchema);

export default Post; 