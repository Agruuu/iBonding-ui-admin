## iBonding System front-end Vue 3 management background project.

1. nodejs > 16.18.0 && pnpm > 8.6.0 (Force the use of pnpm.)
1. Execute the following commands in the root directory to start the project:

```bash
# Install pnpm to improve the installation speed of dependencies.
npm config set registry https://registry.npmmirror.com
npm install -g pnpm
# Install dependencies.
pnpm install

# Start the service.
npm run dev
```

2. After the startup is complete, the browser will automatically open the address [http://localhost:80 (opens new window)](http://localhost/), and you can see the front - end interface.

3. Friendly reminder: Vue 3 is built with Vite, so the following situations are all normal:

   1. The project starts up quickly, but it takes about a minute for the browser to open. Please be patient.
   2. When you click on the menu, you may feel a bit of lag because Vite uses a lazy - loading mechanism. Don't worry. This issue will not exist when the project is finally deployed to the production environment. 

4. Question: What should I do if I don't want to start the backend project?

   You can replace the `npm run dev` command mentioned above with the `npm run dev-server` command.

   
   
   ## Technology stack.
   
   | 框架                                               | Instruction                       | Version |
   | -------------------------------------------------- | --------------------------------- | ------- |
   | [Vue](https://staging-cn.vuejs.org/)               | Vue framework                     | 3.3.8   |
   | [Vite](https://cn.vitejs.dev//)                    | Development and build tools       | 4.5.0   |
   | [Element Plus](https://element-plus.org/zh-CN/)    | Element Plus                      | 2.4.2   |
   | [TypeScript](https://www.typescriptlang.org/docs/) | A superset of JavaScript          | 5.2.2   |
   | [pinia](https://pinia.vuejs.org/)                  | Vue store library, replace Vuex 5 | 2.1.7   |
   | [vueuse](https://vueuse.org/)                      | Common utility                    | 10.6.1  |
   | [vue-router](https://router.vuejs.org/)            | Vue route                         | 4.2.5   |
   | [unocss](https://uno.antfu.me/)                    | Atomic css                        | 0.57.4  |
   | [iconify](https://icon-sets.iconify.design/)       | Online icon library               | 3.1.1   |
   | [wangeditor](https://www.wangeditor.com/)          | Text editor                       | 5.1.23  |



## Development tools.

It is recommended to use VS Code for development, and the following plugins are recommended for use in conjunction:

| plugins              | Functionality              |
| -------------------- | -------------------------- |
| Vue - Official       | Vue and TypeScript support |
| unocss               | unocss for vscode          |
| Iconify IntelliSense | Iconify preview and search |
| Stylelint            | CSS formatting             |
| Prettier             | Code formatting            |
| ESLint               | Script code inspection     |
| DotENV               | .env file highlighting     |