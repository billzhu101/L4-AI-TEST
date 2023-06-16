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
      href: '@/assets/PI.png',
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
