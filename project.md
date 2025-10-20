

# 部署前端
- 使用 cloudflare 部署
控制台地址：https://dash.cloudflare.com
用户名和密码:
1218128305@qq.com
****** 自己的密码

## qq邮箱
opsokizeoixxjiie

## emailjs
https://dashboard.emailjs.com/admin
1218128305@qq.com
zs199602.

service_atf6qh8
template_pj969oq
公用密钥
4_aa__Eo4tqK9-cZt
私钥
a1l7xJf3pKBG8nHRtTp95

## 澳大利亚城市
Sydney 悉尼
Melbourne 墨尔本
Brisbane 布里斯班
Canberra 堪培拉
Adelaide 阿德莱德

## 澳大利亚景点
Uluru-Kata Tjuta National Park
Blue Mountains National Park
Great Barrier Reef


# 健康营养教育平台

一个现代化的健康营养教育网站，提供全面的营养教育资源、地图导航服务和营养信息查询功能。

## 🚀 技术栈

- **前端框架**: Vue 3 + Vite
- **UI组件库**: PrimeVue + TailwindCSS
- **地图服务**: Mapbox GL
- **后端服务**: Firebase (认证 + Firestore数据库)
- **构建工具**: pnpm
- **开发语言**: TypeScript + JavaScript

## 📋 功能模块详解

### 1. 用户前端界面系统

#### 首页展示模块
- **动态横幅**: 支持视差滚动效果的英雄区域，提升视觉体验
- **资源分类**: 五大营养教育主题（健康饮食基础、营养与心理健康、弱势群体营养、文化与社区营养、学校营养计划）
- **评分展示**: 实时显示每个教育资源的平均评分，基于Firebase Firestore计算

#### 教育资源详情页
- **参数化路由**: 支持动态路由参数传递，如`/resourcesDetail/:index`
- **内容展示**: 详细的教育资源信息，包括关键要点和目标受众标签
- **图片资源**: 高质量的教育主题图片，提升内容吸引力

#### 导航组件
- **头部导航**: 包含Logo、导航菜单和用户状态显示
- **路由守卫**: 实现页面访问权限控制

### 2. 智能地图导航系统

#### 地图核心功能
- **Mapbox集成**: 使用Mapbox GL JS v3.15.0，提供高性能的地图渲染
- **多模式路线规划**: 支持驾车、步行、骑行、驾车交通四种出行方式
- **智能模式选择**: 根据距离自动选择最优的交通方式（500km以上仅驾车，100km以上排除步行骑行）

#### 搜索与定位功能
- **地理编码搜索**: 基于Mapbox Places API实现位置搜索
- **兴趣点搜索**: 专门针对旅游景点和健康相关场所的搜索
- **实时搜索结果**: 支持搜索结果的实时显示和选择

#### 路线规划技术
- **距离计算**: 使用Haversine公式计算直线距离，智能判断路线可行性
- **多API尝试**: 自动尝试多种交通方式API，确保路线规划成功率
- **错误处理**: 完善的错误处理机制，提供友好的用户提示

#### 可视化功能
- **自定义标记**: 支持不同颜色的起点、终点和兴趣点标记
- **路线绘制**: 实时绘制最优路线，显示距离和预计时间
- **地图控制**: 支持缩放、平移和自动适应路线范围

### 3. 营养信息查询系统

#### 数据管理
- **静态数据集**: 包含8种常见食物的详细营养成分数据
- **数据结构**: 包含食物名称、类别、热量、蛋白质、脂肪、碳水化合物、糖分等字段
- **分类体系**: 按水果、肉类、鱼类、蛋白质等类别组织

#### 用户界面功能
- **数据表格**: 使用PrimeVue DataTable组件，支持排序、分页和筛选
- **全局搜索**: 实时搜索功能，支持多字段匹配
- **分页控制**: 可配置的页面大小（2, 5, 10, 25条/页）

#### 数据导出
- **CSV导出**: 一键导出完整营养数据到CSV文件
- **文件命名**: 自动生成包含日期的文件名
- **格式优化**: 正确处理特殊字符和数字格式

### 4. 用户认证与权限管理系统

#### 认证流程
- **Firebase Auth**: 集成Firebase身份验证服务
- **注册登录**: 完整的用户注册和登录流程
- **会话持久化**: 使用localStorage保存用户状态

#### 权限控制
- **角色区分**: 管理员和普通用户权限分离
- **路由守卫**: 基于用户角色的页面访问控制
- **管理员验证**: 特定邮箱地址识别为管理员账户

#### 安全特性
- **环境变量**: 敏感配置通过环境变量管理
- **输入验证**: 客户端和服务端双重验证
- **错误处理**: 完善的错误提示和异常处理

### 5. 管理后台系统

#### 评论管理模块
- **评论审核**: 查看和管理用户对教育资源的评论
- **评分统计**: 实时计算和显示平均评分
- **数据关联**: 评论与具体教育资源的关联管理

#### 用户管理功能
- **用户列表**: 显示所有注册用户信息
- **状态管理**: 用户状态的管理和更新
- **数据操作**: 支持用户数据的增删改查

#### 后台界面
- **侧边栏导航**: 清晰的菜单结构和当前页面指示
- **响应式设计**: 适配不同屏幕尺寸的管理界面
- **操作便捷**: 一键操作和批量处理功能

### 6. 邮件发送与联系系统

#### 前端联系表单
- **响应式表单设计**: 基于PrimeVue组件的现代化表单界面
- **实时表单验证**: 客户端即时验证用户输入和文件类型
- **文件上传功能**: 支持PDF、Word文档、图片文件上传（最大10MB）
- **加载状态管理**: 发送过程中的加载指示器和禁用状态
- **用户反馈**: 成功/失败提示和确认邮件发送

#### 后端邮件服务
- **Express服务器**: 基于Node.js和Express框架的RESTful API
- **SMTP集成**: 使用Nodemailer集成多种邮件服务提供商
- **文件处理**: Multer中间件处理文件上传和验证
- **安全防护**: 双重文件验证和自动清理临时文件
- **错误处理**: 完善的错误日志和用户友好的错误信息

#### 邮件功能特性
- **自动回复**: 向用户发送确认邮件，提升用户体验
- **HTML邮件模板**: 专业的邮件格式和品牌一致性
- **附件支持**: 完整的附件上传、验证和发送流程
- **多提供商支持**: 兼容Gmail、QQ邮箱等主流邮件服务

### 7. 技术架构特色

#### 前端架构
- **Vue 3组合式API**: 使用setup语法糖，代码结构清晰
- **组件化开发**: 高度复用的组件设计模式
- **状态管理**: 基于Vue响应式系统的状态管理

#### 构建优化
- **Vite构建**: 快速的冷启动和热重载
- **代码分割**: 按需加载的代码分割策略
- **Tree Shaking**: 自动移除未使用代码

#### 开发工具
- **TypeScript支持**: 提供类型安全和更好的开发体验
- **ESLint配置**: 统一的代码风格和质量标准
- **开发服务器**: 支持热更新的开发环境

## ✨ 项目亮点

### 技术创新
- **地图集成**: 深度集成Mapbox地图服务，提供专业的路线规划功能
- **实时数据**: 使用Firebase Firestore实现实时评分和评论系统
- **现代化架构**: 基于Vue 3的组合式API，代码结构清晰易维护

### 用户体验
- **交互优化**: 平滑的动画效果和直观的操作界面
- **性能优化**: Vite构建工具提供快速的开发体验和构建速度

### 功能特色
- **多模式导航**: 支持驾车、步行、骑行等多种出行方式
- **智能搜索**: 基于地理位置和关键词的智能搜索功能
- **数据可视化**: 营养成分数据的表格展示和导出功能
- **权限控制**: 完善的角色权限管理系统

## 🛠️ 项目结构

```
health-web/
├── public/                 # 静态资源
│   ├── img/               # 图片资源
│   └── json/              # JSON数据文件
├── src/
│   ├── assets/            # 样式资源
│   ├── common/            # 公共工具和配置
│   ├── components/        # 公共组件
│   ├── plugins/           # Vue插件配置
│   ├── router/            # 路由配置
│   └── views/             # 页面组件
│       ├── admin/         # 管理后台页面
│       └── auth/          # 认证相关页面
```

## 🚀 快速开始

### 环境要求
- Node.js 16+
- pnpm 7+

### 安装依赖
```sh
pnpm install
```

### 开发环境
```sh
pnpm dev
```

### 生产构建
```sh
pnpm build
```

### 代码检查
```sh
pnpm lint
```

## 📧 邮件发送功能配置

### 启动邮件服务
邮件发送功能需要单独启动后端服务：

```sh
# 进入server目录
cd server

# 安装依赖
npm install

# 启动邮件服务（需要配置环境变量）
npm start

# 开发模式启动（自动重启）
npm run dev
```

### 邮件服务功能特性
- **支持附件上传**：PDF、Word文档、图片文件（最大10MB）
- **双重验证**：客户端和服务端双重文件类型和大小验证
- **自动回复**：发送确认邮件给用户
- **错误处理**：完善的错误处理和用户提示
- **文件安全**：自动清理临时上传文件

### SMTP配置说明
项目支持多种邮件服务提供商：

#### Gmail配置
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

#### QQ邮箱配置
```env
SMTP_HOST=smtp.qq.com
SMTP_PORT=587
SMTP_USER=your-email@qq.com
SMTP_PASS=your-authorization-code
```

#### 其他SMTP服务
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password
```

### 前端邮件表单功能
- **表单验证**：实时验证用户输入和文件类型
- **文件预览**：显示已选择文件的名称和大小
- **加载状态**：发送过程中的加载指示器
- **成功反馈**：发送成功后的确认提示
- **错误处理**：友好的错误提示信息

## 🔧 环境配置

项目使用环境变量配置，需要创建 `.env` 文件并配置以下变量：

### 前端环境变量
```env
VITE_API_KEY=your_firebase_api_key
VITE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_PROJECT_ID=your_firebase_project_id
VITE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_MESSAGING_SENDER_ID=your_firebase_sender_id
VITE_APP_ID=your_firebase_app_id
VITE_MapboxglAccessToken=your_mapbox_access_token
VITE_EMAIL_API_URL=http://localhost:3001/api/send-email
```

### 邮件服务环境变量（后端）
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CONTACT_EMAIL=contact@health-education.com
```

## 📈 未来规划

- [ ] 增加营养计算器功能
- [ ] 实现个性化推荐系统
- [ ] 添加社交分享功能
- [ ] 开发移动端APP
- [ ] 集成更多健康数据API

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进这个项目。

## 📄 许可证

本项目采用MIT许可证。