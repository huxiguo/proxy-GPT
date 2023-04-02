const Koa = require('koa')
const { request, ProxyAgent } = require('undici')
const Router = require('@koa/router')
const API_KEY = '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'
const app = new Koa()
const router = new Router()
router.get('/', async (ctx, next) => {
  let msg = ctx.query.msg
  ctx.body = `Hello World! ctx.query.msg:${msg}`
})
router.get('/test', async function (ctx) {
  let msg = ctx.query.msg
  try {
    const res = await request('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: msg }]
      }),
      dispatcher: new ProxyAgent('http://127.0.0.1:7890')
    })
    const completion = await res.body.json()
    let str = completion.choices[0].message.content
    ctx.body = str
  } catch (error) {
    ctx.body = '出错啦，请联系管理员'
  }
})
app.use(router.routes())
app.use(router.allowedMethods())
app.listen(8800, () => {
  console.log('Server is running at http://localhost:8800')
})
