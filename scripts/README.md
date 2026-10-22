# 布丁图标生成

`generate-favicon.cjs` 从 `src/App.tsx` 提取原始 `Pudding` 组件，使用 `src/style.css` 的原始样式单独渲染；不是网页截图。冻结上下浮动动画，在透明正方形画布内按比例放大，不含首页平台或装饰。

生成文件已提交，日常开发和 CI 构建无需安装额外工具。仅需重新生成时，在仓库外安装 Playwright，并指定其模块及 Chromium 的路径：

```sh
npm install --prefix /tmp/pudding-browser playwright
PLAYWRIGHT_MODULE=/tmp/pudding-browser/node_modules/playwright CHROMIUM_PATH=/usr/bin/chromium node scripts/generate-favicon.cjs
```

favicon.ico 内含 16、32、48、64 像素图层；PNG 为 192 和 512 像素。由于原素材是 CSS 绘制而非矢量素材，favicon.svg 内嵌 512 像素 PNG，避免重新描摹造成外观差异。更换机器字体可能影响原组件的文字嘴形，重新生成后请检查图像。
