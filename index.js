const Koa = require('koa')
const { request, ProxyAgent } = require('undici')
const Router = require('@koa/router')
const API_KEY = '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'
const app = new Koa()
const router = new Router()
router.get('/', async (ctx, next) => {
  ctx.body = 'Hello, World!'
})
router.get('/test', async function (ctx) {
  ctx.query.key = ctx.query.key
  const res = await request('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Hello world' }]
    }),
    dispatcher: new ProxyAgent('http://127.0.0.1:7890')
  })
  const completion = await res.body.json()
  let str = completion.choices[0].message.content
  ctx.body = str
})
app.use(router.routes())
app.use(router.allowedMethods())
app.listen(8800, () => {
  console.log('Server is running at http://localhost:8800')
})
