# 布丁的注音小教室 🍮

面向零基础学习者的响应式学习网站，使用 React、TypeScript、Vite 和 Tailwind CSS。无登录、数据库或付费服务。

## 运行

需要 Node.js 22.12+（当前验证版本为 24.19.0）及 npm。

```sh
npm ci
npm run dev
```

在自己的电脑浏览器打开终端显示的地址（默认端口 5173）。云端开发需要使用平台的端口转发功能并转发 5173 端口；如果平台未提供预览，可将分支克隆到本地运行。不要将开发服务器直接暴露到公共互联网。

```sh
npm run build  # TypeScript 检查及生产构建，输出 dist/
npm test       # 交互及本地记录回归测试
npm run preview # 本地预览构建结果，默认端口 4173
```

生产部署可以使用任意静态网站服务托管 dist/。不需要环境变量、API 密钥或后端服务。

## 第一版功能

- 学习首页及课程完成进度
- ㄅㄆㄇㄈ、ㄉㄊㄋㄌ两堂国语注音课程：符号、汉语拼音对照、发音位置及例字
- 四题即时反馈练习，锁定已选答案并计算成绩，可重复练习
- 完成一堂课后，用 localStorage 保存课程状态；只在当前浏览器生效，不跨设备同步，清除浏览器数据会移除记录
- 独立台湾台语入口，明确标记尚未推出
- 手机菜单、键盘焦点提示、减少动态效果偏好支持

注音及汉语拼音在这里标示台湾国语，不表示台湾台语。第一版使用文字发音说明，未提供录音或语音评分。课程完成状态由学习者点击完成标记，不代表通过测验。

## 合并

分支：`feat/pudding-classroom`。推送后可以在 GitHub 创建以 main 为目标的 Pull Request。或在本地执行：

```sh
git fetch origin
git switch main
git pull --ff-only origin main
git merge --no-ff origin/feat/pudding-classroom
git push origin main
```

## GitHub Pages 自动部署

仓库 Settings → Pages → Source 选择 **GitHub Actions**。合并到 `main` 后，工作流会安装锁定依赖、检查 TypeScript、构建、运行交互测试，再将 `dist/` 部署至 Pages。也可以在 Actions → Deploy to GitHub Pages → Run workflow 中选择 main 手动重试。

部署成功后访问：https://buding135790.github.io/pudding-bopomofo/

Vite 的 `base` 已设为 `/pudding-bopomofo/`。本地预览也应访问该子路径。网站以 React 状态切换课程，不使用路径路由，因此首页及课程页刷新均请求同一入口，不需要 404 回退；刷新会回到学习首页，已保存的课程完成记录仍保留。

localStorage 按网站来源隔离：本地预览的学习记录不会迁移到 GitHub Pages。相同 Pages 地址下后续更新保留既有记录，除非用户清除浏览器数据。

发布后可在手机或浏览器设备模式下检查窄屏菜单、课程切换、练习反馈及刷新后的学习记录。首次真实部署与真实设备显示需要在 Pages 发布后确认。
