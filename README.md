<h1>🎊 YDcrm frontend - Next.js</h1>
<h3>1. What's this - 这是什么</h3>
This is the frontend of a CRM system which is created for my dad's company. In order to keep this system and its data safe, I intentionally deleted most of the backend code from this application. This repository is used as one of my portfolio. I will try my best to keep it up to date. <br/>
这是我为我父亲公司所构建的一个 CRM 系统的前端部分。为了确保系统和数据的安全，我有意删除了大部分后端代码。该仓库是我个人作品集的其中之一，我会尽我最大的努力保持该版本的更新
<h3>2. How to run - 如何运行</h3>
This application requires node 18+, please make sure that you have a relatively new node version <br/>
<br/>
!! There is something you have to know before you make your first step. This is a frontend version which is extracted after I finished the application, and most frontend code has been integrated tightly with my backend while you don't have backend in this repo, so currently, I'm trying to put some mock data on it so that this version can get rid of file not found errors. This takes some time. If you don't want to wait, you can open the mock folder and match them to its corresponding components or fill some data by yourself. I'll try my best to solve this problem ASAP.
<br/>
First, install all the dependencies:

```bash
npm install
# or
yarn install
# or
bun install
```

Second, run the dev server
```bash
npm run dev
# or
yarn dev
# or
bun run dev
```

Then you can open it by visiting localhost:3000 in your browser (if there's no exception)
<h3>3. Main Tech Stack - 主要技术栈</h3>
<strong>1. Next.js:</strong><br/>
I use next to do fullstack development for this application, using server action to implement backend. <br/>
<strong>2. TailwindCSS + shadCN</strong><br/>
shadcn UI is widely used in this application, especially for building form and modals. I also extended some components like tree-structure lists and did some encapsulation of form items with full typescript support which you can find it and even more in the components folder<br/>
<strong>3. Zustand</strong><br/>
Really a light-weight state management package, having similar experience compared to pinia (I think so personally). Recommend you guys to have to try.<br/>

For more detailed package information, check package.json.
🌟 Star if you like this. Thank you very much.