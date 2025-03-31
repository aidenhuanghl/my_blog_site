# 个人博客应用

一个使用Next.js 14、MongoDB和Vercel构建的现代个人博客应用。

## 功能

- 响应式设计，适配移动和桌面设备
- 支持暗色/亮色模式
- 基于角色的访问控制
- Markdown内容支持，包括代码语法高亮
- 图片上传和管理
- 用户评论系统
- 标签分类和搜索功能
- SEO优化
- 仪表盘管理文章、用户和评论

## 技术栈

- **前端**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **后端**: Next.js API Routes, MongoDB/Mongoose
- **认证**: NextAuth.js
- **图片存储**: Cloudinary
- **部署**: Vercel

## 快速开始

### 前置条件

- Node.js 18+
- npm 或 yarn
- MongoDB 数据库 (本地或MongoDB Atlas)

### 安装

1. 克隆仓库:
   ```bash
   git clone https://github.com/yourusername/your-blog-repo.git
   cd your-blog-repo
   ```

2. 安装依赖:
   ```bash
   npm install
   # 或
   yarn install
   ```

3. 环境配置:
   - 复制 `.env.example` 文件为 `.env.local`
   - 填写必要的环境变量:
     ```
     # MongoDB 连接
     MONGODB_URI=your_mongodb_connection_string
     
     # NextAuth 配置
     NEXTAUTH_URL=http://localhost:3000
     NEXTAUTH_SECRET=your_nextauth_secret
     
     # Cloudinary
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     ```

4. 运行开发服务器:
   ```bash
   npm run dev
   # 或
   yarn dev
   ```

5. 在浏览器中打开 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
/app                  # Next.js App Router
  /(pages)            # 路由分组
    /admin            # 管理后台页面
    /auth             # 认证页面
    /posts            # 文章页面
  /api                # API路由
    /auth             # 认证API
    /posts            # 文章API
    /comments         # 评论API
    /users            # 用户API
  /components         # 共享组件
  /lib                # 工具函数
  /models             # Mongoose模型
  /hooks              # 自定义Hooks
  /utils              # 实用工具函数
```

## API路由

### 文章

- `GET /api/posts` - 获取文章列表，支持分页和搜索
- `POST /api/posts` - 创建新文章
- `GET /api/posts/[slug]` - 获取单篇文章
- `PUT /api/posts/[slug]` - 更新文章
- `DELETE /api/posts/[slug]` - 删除文章

### 用户

- `GET /api/users` - 获取用户列表 (仅管理员)
- `POST /api/users` - 创建新用户 (注册)
- `GET /api/users/[id]` - 获取用户信息
- `PUT /api/users/[id]` - 更新用户信息
- `DELETE /api/users/[id]` - 删除用户 (仅管理员)

### 评论

- `GET /api/comments?postId=123` - 获取文章评论
- `POST /api/comments` - 添加评论
- `DELETE /api/comments/[id]` - 删除评论

## 部署

本应用设计用于Vercel部署，只需连接GitHub仓库并设置环境变量即可。

## 测试

```bash
npm run test
# 或
yarn test
```

## 许可证

MIT 