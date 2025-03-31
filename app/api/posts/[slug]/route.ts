import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import Post from '@/app/models/Post';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// 获取单篇文章
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  
  try {
    await connectToDatabase();
    
    const post = await Post.findOne({ slug, published: true })
      .populate('author', 'name avatar')
      .select('-__v');
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// 更新文章
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  
  try {
    // 验证用户身份和权限
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // 连接到数据库
    await connectToDatabase();
    
    // 获取文章
    const post = await Post.findOne({ slug });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // 验证作者权限（只有作者和管理员可以编辑）
    const isAdmin = session.user.role === 'admin';
    const isAuthor = post.author.toString() === session.user.id;
    
    if (!isAdmin && !isAuthor) {
      return NextResponse.json(
        { error: 'You do not have permission to edit this post' },
        { status: 403 }
      );
    }
    
    // 解析请求数据
    const data = await request.json();
    
    // 验证必填字段
    if (!data.title || !data.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }
    
    // 检查新slug是否已存在（如果提供了新的slug）
    if (data.slug && data.slug !== slug) {
      const existingPost = await Post.findOne({ slug: data.slug });
      if (existingPost) {
        return NextResponse.json(
          { error: 'A post with this slug already exists' },
          { status: 409 }
        );
      }
    }
    
    // 如果状态从未发布变为已发布，设置发布日期
    if (!post.published && data.published) {
      data.publishedAt = new Date();
    }
    
    // 更新文章
    const updatedPost = await Post.findOneAndUpdate(
      { slug },
      { ...data },
      { new: true, runValidators: true }
    ).populate('author', 'name avatar');
    
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error(`Error updating post with slug ${slug}:`, error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// 删除文章
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  
  try {
    // 验证用户身份和权限
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // 连接到数据库
    await connectToDatabase();
    
    // 获取文章
    const post = await Post.findOne({ slug });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // 验证作者权限（只有作者和管理员可以删除）
    const isAdmin = session.user.role === 'admin';
    const isAuthor = post.author.toString() === session.user.id;
    
    if (!isAdmin && !isAuthor) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this post' },
        { status: 403 }
      );
    }
    
    // 删除文章
    await Post.findOneAndDelete({ slug });
    
    return NextResponse.json(
      { message: 'Post deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting post with slug ${slug}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
} 