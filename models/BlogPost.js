import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, required: true },
  tags: [{ type: String }],
  category: { type: String, default: 'General' },
  readTime: { type: String },
  publishedAt: { type: String },
  order: { type: Number, default: 0 }
}, { timestamps: true });

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
export default BlogPost;
