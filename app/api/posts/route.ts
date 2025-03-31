import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import Post from '@/app/models/Post';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// 获取文章列表
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const tag = searchParams.get('tag');
  const search = searchParams.get('search');
  
  const skip = (page - 1) * limit;
  
  try {
    await connectToDatabase();
    
    let query: any = { published: true };
    
    // 如果有标签筛选
    if (tag) {
      query.tags = tag;
    }
    
    // 如果有搜索关键词
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }
    
    // 执行查询
    const posts = await Post.find(query)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name avatar')
      .select('-__v');
    
    // 获取总数
    const total = await Post.countDocuments(query);
    
    return NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// 创建新文章
export async function POST(request: NextRequest) {
  try {
    // 验证用户身份和权限
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
    if (!data.title || !data.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }
    
    // 连接到数据库
    await connectToDatabase();
    
    // 创建slug（URL友好的标题）
    const slug = data.slug || 
      data.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
    
    // 检查slug是否已存在
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 409 }
      );
    }
    
    // 创建新文章
    const newPost = new Post({
      ...data,
      slug,
      author: session.user.id,
      published: data.published || false,
      publishedAt: data.published ? new Date() : null,
    });
    
    await newPost.save();
    
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
} 