# 匿名意见反馈

无需登录的匿名意见箱（也可以加选项变成投票），部署在 Vercel，数据存在 Upstash Redis。

- 不记录姓名、IP；留言只保存日期（不含时分秒）
- 可以多次提交；同一 IP 5 秒内只能提交一次（只临时存 IP 的加盐哈希）

## 修改内容

编辑 `poll.config.js`（标题、说明、意见是否公开），推送后 Vercel 自动重新部署。
改 `id` = 开启新一轮收集。

## 部署

1. 在 Vercel 导入这个 GitHub 仓库（Framework 选 Other，其他默认）
2. 项目 → Storage → 添加 **Upstash for Redis**（免费档即可），连接到该项目
3. （可选）Settings → Environment Variables 添加 `ADMIN_KEY`
   - 当 `publicResults: false` 时，用 `https://你的域名/?key=ADMIN_KEY` 查看结果
4. Redeploy 一次让环境变量生效

## 本地预览

```bash
npm install
npm run dev   # http://localhost:3000，不配 Redis 时用内存存储
```
