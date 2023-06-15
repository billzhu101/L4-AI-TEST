import { defineConfig } from 'umi';
import routes from './routes';

let publicPath = '/';

export default defineConfig({
  publicPath,
  nodeModulesTransform: {
    type: 'none',
  },
  qiankun: {
    slave: {},
  },
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  history: {
    type: 'browser',
  },
  links: [
    {
      rel: 'shortcut icon',
      href: 'data:image/png;base64,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',
    },
  ],
  routes,
  copy: [
    {
      from: 'src/manage/processor.worker.js',
      to: 'some/processor.worker.js',
    },
    {
      from: 'src/manage/processor.worklet.js',
      to: 'some/processor.worklet.js',
    },
  ],
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {},
  theme: {
    'primary-color': '#0365ce',
  },
});
