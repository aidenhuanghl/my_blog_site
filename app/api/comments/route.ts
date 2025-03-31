import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import Comment from '@/app/models/Comment';
import Post from '@/app/models/Post';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// 获取评论列表（按文章ID）
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('postId');
  
  if (!postId) {
    return NextResponse.json(
      { error: 'Post ID is required' },
      { status: 400 }
    );
  }
  
  try {
    await connectToDatabase();
    
    // 检查文章是否存在
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // 获取文章的评论
    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .populate('author', 'name avatar')
      .select('-__v');
    
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// 创建评论
export async function POST(request: NextRequest) {
  try {
    // 验证用户身份
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // 解析请求数据
    const data = await request.json();
    
    // 验证必填字段
    if (!data.content || !data.postId) {
      return NextResponse.json(
        { error: 'Content and postId are required' },
        { status: 400 }
      );
    }
    
    // 连接到数据库
    await connectToDatabase();
    
    // 检查文章是否存在
    const post = await Post.findById(data.postId);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // 创建评论
    const newComment = new Comment({
      content: data.content,
      post: data.postId,
      author: session.user.id,
    });
    
    await newComment.save();
    
    // 返回完整评论（包括作者信息）
    const populatedComment = await Comment.findById(newComment._id)
      .populate('author', 'name avatar')
      .select('-__v');
    
    return NextResponse.json(populatedComment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
} 