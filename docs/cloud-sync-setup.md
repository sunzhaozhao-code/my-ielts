# Supabase 跨设备同步配置

登录功能是可选能力。没有下面的配置时，应用仍会把学习数据保存在浏览器 `localStorage` 中。

## 1. 创建 Supabase 项目

登录 [Supabase Dashboard](https://supabase.com/dashboard)，创建一个免费项目并等待数据库初始化完成。

## 2. 创建学习进度表和访问规则

在 Supabase 项目的 **SQL Editor** 中打开并执行：

```text
supabase/migrations/001_study_progress.sql
```

脚本会创建 `study_progress` 表、启用 Row Level Security，并限制每个登录用户只能读写与自己 `user_id` 相同的数据。

## 3. 配置登录跳转地址

在 **Authentication → URL Configuration** 中设置：

- Site URL：正式网站地址，例如 `https://用户名.github.io/仓库名/`
- Redirect URLs：加入正式网站地址，以及本地开发地址 `http://localhost:3333/`

登录邮件会返回网站的 `#/account` 页面。

## 4. 本地开发配置

从 Supabase 项目的 **Settings → API** 复制 Project URL 和 Publishable Key，在项目根目录新建 `.env.local`：

```env
VITE_SUPABASE_URL=https://你的项目.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=你的-publishable-key
```

重新启动开发服务器后，导航中的“账号”页面会出现邮箱登录表单。

## 5. GitHub Pages 配置

在 GitHub 仓库 **Settings → Secrets and variables → Actions → Variables** 中新增：

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

这两个值会在 GitHub Actions 构建时写入前端。Publishable Key 可以出现在浏览器代码中，真正的数据隔离由迁移脚本中的 RLS 策略保证。

不要添加或公开 `service_role` 密钥。

## 同步规则

- 未登录：只保存到当前浏览器。
- 首次登录且云端为空：把当前浏览器进度上传到该账号。
- 新设备登录且本地为空：下载云端进度。
- 本地和云端都有不同进度：由用户选择保留本机或云端版本，避免自动覆盖。
- 登录后：学习数据变更会延迟约 1.2 秒自动同步；窗口重新获得焦点或网络恢复时也会检查云端版本。
- 退出登录：先尝试上传最新进度，再清除该浏览器中的账号学习数据，防止共享电脑上的下一位用户看到记录。
