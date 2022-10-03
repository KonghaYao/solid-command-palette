/// <reference types="vitest" />

import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  css: {
    modules: {
      // 一般我们可以通过 generateScopedName 属性来对生成的类名进行自定义
      // 其中，name 表示当前文件名，local 表示类名
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
    preprocessorOptions: {
      // 省略预处理器配置
    },
  },
  build: {
    target: 'esnext',
  },
  test: {
    environment: 'happy-dom',
    clearMocks: true,
  },
});
