# CloudBase 云端数据库集成说明

## 环境 ID

`careercraft-d4gfk3hi163786996`（与 `cloudbaserc.json` 一致）

## 自动启用的集合

首次写入时自动创建，无需手动建表：

| 集合 | 用途 |
|------|------|
| `cv_users` | 用户账号（注册/登录持久化） |
| `cv_user_materials` | 个人素材库 |
| `cv_user_applications` | 投递记录 |
| `cv_user_profiles` | 用户资料 |
| `cv_workspace_snapshot` | **团队共享快照**（跨用户可见） |

## CloudRun 环境变量

CloudBase 容器通常自动注入：

```env
TCB_ENV=careercraft-d4gfk3hi163786996
TENCENTCLOUD_SECRETID=...
TENCENTCLOUD_SECRETKEY=...
JWT_SECRET=强随机字符串
NEXT_PUBLIC_SITE_URL=https://你的域名
```

也可手动设置：

```env
USE_CLOUDBASE=true
CLOUDBASE_ENV_ID=careercraft-d4gfk3hi163786996
```

本地开发默认走 SQLite；设置 `USE_CLOUDBASE=true` 可联调云端。

## 多端 / 跨用户同步验证

### 同一账号 · 多端（电脑 ↔ 手机）

1. 电脑登录账号 A，在「素材库」新增一段经历
2. 手机浏览器打开同一链接，登录**同一账号 A**
3. 等待约 8 秒或切换回页面，素材自动出现

### 不同账号 · 跨用户（用户 A → 用户 B 可见）

1. 用户 A 登录，素材库新增经历
2. 用户 B 登录，打开「素材库」下方 **「团队共享素材（云端）」**
3. 约 8 秒内可看到用户 A 录入的内容

### API 探测

```bash
curl https://你的域名/api/sync/status
curl -H "Authorization: Bearer TOKEN" https://你的域名/api/workspace/materials
```

## 控制台

[CloudBase 控制台](https://tcb.cloud.tencent.com/dev?envId=careercraft-d4gfk3hi163786996#/db/doc)

可在「文档型数据库」中查看 `cv_*` 集合数据。
