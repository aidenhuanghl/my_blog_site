import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import User from '@/app/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// 获取用户列表（仅管理员可访问）
export async function GET(request: NextRequest) {
  try {
    // 验证用户身份和权限
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // 检查是否为管理员
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }
    
    // 连接到数据库
    await connectToDatabase();
    
    // 解析查询参数
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');
    
    const skip = (page - 1) * limit;
    
    // 构建查询
    let query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    
    // 执行查询，排除密码字段
    const users = await User.find(query)
      .select('-password -__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // 获取总数
    const total = await User.countDocuments(query);
    
    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// 创建新用户（注册）
export async function POST(request: NextRequest) {
  try {
    // 解析请求数据
    const data = await request.json();
    
    // 验证必填字段
    if (!data.name || !data.email || !data.password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }
    
    // 验证密码长度
    if (data.password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }
    
    // 连接到数据库
    await connectToDatabase();
    
    // 检查邮箱是否已存在
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      );
    }
    
    // 设置默认角色为author
    const role = 'author';
    
    // 创建新用户
    const newUser = new User({
      name: data.name,
      email: data.email,
      password: data.password,
      bio: data.bio || '',
      avatar: data.avatar || '',
      role,
    });
    
    await newUser.save();
    
    // 排除密码后返回用户信息
    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      bio: newUser.bio,
      avatar: newUser.avatar,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };
    
    return NextResponse.json(userResponse, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 