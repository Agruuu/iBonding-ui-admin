import { resolve } from 'path'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import progress from 'vite-plugin-progress'
import EslintPlugin from 'vite-plugin-eslint'
import PurgeIcons from 'vite-plugin-purge-icons'
import { ViteEjsPlugin } from 'vite-plugin-ejs'
// @ts-ignore
import ElementPlus from 'unplugin-element-plus/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import viteCompression from 'vite-plugin-compression'
import topLevelAwait from 'vite-plugin-top-level-await'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import UnoCSS from 'unocss/vite'

export function createVitePlugins() {
  const root = process.cwd()

  // Path search
  function pathResolve(dir: string) {
    return resolve(root, '.', dir)
  }

  return [
    Vue(),
    VueJsx(),
    UnoCSS(),
    progress(),
    PurgeIcons(),
    ElementPlus({}),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/ // .md
      ],
      imports: [
        'vue',
        'vue-router',
        // Components that require auto - import can be added additionally.
        {
          '@/hooks/web/useI18n': ['useI18n'],
          '@/hooks/web/useMessage': ['useMessage'],
          '@/hooks/web/useTable': ['useTable'],
          '@/hooks/web/useCrudSchemas': ['useCrudSchemas'],
          '@/utils/formRules': ['required'],
          '@/utils/dict': ['DICT_TYPE']
        }
      ],
      dts: 'src/types/auto-imports.d.ts',
      resolvers: [ElementPlusResolver()],
      eslintrc: {
        enabled: false, // Default `false`
        filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      }
    }),
    Components({
      // Generate a custom global declaration for `auto-components.d.ts`.
      dts: 'src/types/auto-components.d.ts',
      // Parser for custom components
      resolvers: [ElementPlusResolver()],
      globs: ["src/components/**/**.{vue, md}", '!src/components/DiyEditor/components/mobile/**']
    }),
    EslintPlugin({
      cache: false,
      include: ['src/**/*.vue', 'src/**/*.ts', 'src/**/*.tsx'] // Checked files
    }),
    VueI18nPlugin({
      runtimeOnly: true,
      compositionOnly: true,
      include: [resolve(__dirname, 'src/locales/**')]
    }),
    createSvgIconsPlugin({
      iconDirs: [pathResolve('src/assets/svgs')],
      symbolId: 'icon-[dir]-[name]',
      svgoOptions: true
    }),
    viteCompression({
      verbose: true, // Whether to output compression results on the console
      disable: false, // Do you want to disable it
      threshold: 10240, // Files with a size larger than `threshold` (the unit is bytes) will be compressed.
      algorithm: 'gzip', // compression algorithm,Optional [ 'gzip' , 'brotliCompress' ,'deflate' , 'deflateRaw']
      ext: '.gz', // The generated compressed file suffix
      deleteOriginFile: false //Delete source files after compression
    }),
    ViteEjsPlugin(),
    topLevelAwait({
      // https://juejin.cn/post/7152191742513512485
      // The export name of top-level await promise for each chunk module
      promiseExportName: '__tla',
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: (i) => `__tla_${i}`
    })
  ]
}
