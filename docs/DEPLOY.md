# 职航 CareerCraft CN — 服务器部署指南

> 适用于打包上传 Linux 服务器 / Docker 单机部署

---

## 一、部署前检查清单

| 项目 | 状态 | 说明 |
|------|------|------|
| 用户注册/登录 | ✅ | 写入 SQLite `users` 表 |
| 素材库持久化 | ✅ | 登录后同步至 `user_materials` |
| 投递记录持久化 | ✅ | 登录后同步至 `user_applications` |
| 用户资料持久化 | ✅ | 登录后同步至 `user_profile_settings` |
| 数据库文件 | ✅ | 默认 `data/careercraft.db.sqlite` |
| JWT 鉴权 | ⚠️ 必配 | 生产必须设置 `JWT_SECRET` |

---

## 二、本地打包

```bash
cd careercraft-cn
npm install
npm run build
```

构建产物在 `.next/standalone/`，需一并上传：

```
careercraft-cn/
├── .next/standalone/     # 主程序（含 server.js）
├── .next/static/         # 静态资源 → 复制到 standalone/.next/static
├── public/               # 公共资源 → 复制到 standalone/public
├── data/                 # 数据库目录（服务器上创建，需可写）
├── node_modules/sql.js/dist/sql-wasm.wasm   # WASM 文件（若 standalone 未包含）
└── .env.production       # 环境变量（勿提交 Git）
```

**Standalone 启动：**

```bash
cd .next/standalone
node server.js
```

---

## 三、环境变量（`.env.production`）

```env
# 必填 — 生产环境强随机字符串（至少 32 位）
JWT_SECRET=your-strong-random-secret-at-least-32-chars

# 站点 URL
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NODE_ENV=production
PORT=3000

# 数据库路径（推荐挂载持久卷）
DATABASE_PATH=/data/careercraft.db.sqlite

# AI 功能（可选）
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
```

复制模板：

```bash
cp .env.example .env.production
# 编辑填入真实值
```

---

## 四、Linux 服务器部署（推荐）

### 4.1 上传文件

将整个 `careercraft-cn` 项目或 standalone 包上传到服务器，例如 `/opt/careercraft/`。

### 4.2 创建数据目录

```bash
mkdir -p /opt/careercraft/data
chmod 755 /opt/careercraft/data
```

### 4.3 安装 Node.js 22+ 并启动

```bash
cd /opt/careercraft
npm install --production
npm run build

# 或使用 standalone
cd .next/standalone
NODE_ENV=production \
JWT_SECRET="your-secret" \
DATABASE_PATH="/opt/careercraft/data/careercraft.db.sqlite" \
NEXT_PUBLIC_SITE_URL="https://your-domain.com" \
node server.js
```

### 4.4 使用 PM2 守护进程

```bash
npm install -g pm2

pm2 start server.js --name careercraft \
  --cwd /opt/careercraft/.next/standalone \
  --env production

pm2 save
pm2 startup
```

---

## 五、Docker 部署

```bash
docker build -t careercraft-cn .
docker run -d \
  --name careercraft \
  -p 3000:3000 \
  -v careercraft-data:/data \
  -e JWT_SECRET="your-strong-secret" \
  -e DATABASE_PATH=/data/careercraft.db.sqlite \
  -e NEXT_PUBLIC_SITE_URL=https://your-domain.com \
  careercraft-cn
```

**重要：** `-v careercraft-data:/data` 挂载卷，否则容器重建后用户数据丢失。

---

## 六、数据持久化说明

| 数据 | 存储位置 | 跨设备 | 服务器重启 |
|------|----------|--------|-----------|
| 用户账号 | SQLite `users` | ✅ | ✅（需持久卷） |
| 素材库 | SQLite `user_materials` | ✅ 登录后 | ✅ |
| 投递记录 | SQLite `user_applications` | ✅ 登录后 | ✅ |
| 用户资料 | SQLite `user_profile_settings` | ✅ 登录后 | ✅ |
| 登录 Token | 浏览器 localStorage | 同浏览器 7 天 | 不受影响 |

未登录时数据暂存浏览器 localStorage；**登录后自动上传云端并以后以服务端为准**。

---

## 七、管理后台

- 地址：`https://your-domain.com/admin/login`
- 默认账号：`123456` / `123456`
- **生产环境务必修改管理员密码！**

---

## 八、备份数据库

```bash
# 定期备份
cp /opt/careercraft/data/careercraft.db.sqlite \
   /backup/careercraft-$(date +%Y%m%d).sqlite
```

---

## 九、常见问题

**Q: 注册后刷新数据没了？**  
A: 确认 `data/` 目录可写，且 `DATABASE_PATH` 指向持久路径。

**Q: 换浏览器看不到素材？**  
A: 需登录同一账号，素材已绑定 userId 存服务端。

**Q: WASM 找不到？**  
A: 确保 `node_modules/sql.js/dist/sql-wasm.wasm` 存在于运行目录。

**Q: npm 在 PowerShell 报错？**  
A: 使用 `npm.cmd run build` 或 `python scripts/generate-scheme-docx.py`。

---

## 十、验证部署

```bash
# 1. 健康检查
curl http://localhost:3000

# 2. 云端同步状态
curl https://你的域名/api/sync/status

# 3. 注册测试
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"12345678"}'

# 3. 登录测试
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"method":"email","login":"test@example.com","password":"12345678"}'
```

返回 `"success": true` 且含 `token` 即认证链路正常。

## 十一、CloudBase 云端数据库

生产环境（CloudRun）已集成 **CloudBase 文档型数据库**，详见 [`docs/CLOUDBASE.md`](./CLOUDBASE.md)。

- 用户注册/登录 → `cv_users`
- 素材/投递/资料 → `cv_user_*` 集合
- 跨用户共享 → `cv_workspace_snapshot`（素材库页「团队共享素材」）
- 多端自动轮询：每 8 秒 + 页面聚焦时拉取
