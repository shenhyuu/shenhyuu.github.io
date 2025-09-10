export default defineNitroPlugin((nitroApp) => {
    // nitroApp.hooks.hook('render:html', (html, { event }) => {
    //     // 在 <head> 中插入自定义 meta
    //     html.head.push(`<meta name="author" content="Your Name" />`);
    //     html.head.push(`<meta name="keywords" content="nuxt, vue, example" />`);
    //
    //     // 在 <body> 开头插入内容（比如统计脚本）
    //     html.bodyPrepend.push(`
    //   <script>
    //     console.log('页面由 Nuxt 渲染！');
    //   </script>
    // `);
    // });
    //
    // // 可选：监听响应（调试用）
    // nitroApp.hooks.hook('render:response', (response, { event }) => {
    //     // console.log('Response Status:', response.status);
    // });
});