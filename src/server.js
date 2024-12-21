import express from 'express'
import rendertron from 'rendertron-middleware'
import fetch from 'node-fetch'
import url from 'url'

const app = express()

const appUrl = 'localhost:4173'
const renderUrl = 'localhost:3000/render'

function generateUrl (req) {
  return url.format({
    protocol: req.protocol,
    host: appUrl,
    pathname: req.originalUrl
  })
}

function detectBot(userAgent) {
  const bots = [
    'googlebot',
    'bingbot'
  ]

  const agent = userAgent.toLowerCase()

  for(const bot of bots) {
    if (bots.indexOf(agent) > -1) {
      return true
    }
    return false
  }
}

app.get('*', (req, res) => {
  const isBot = detectBot(req.headers['user-agent'])
  if (isBot) {
    console.log('bot je')
    const botUrl = generateUrl(req)
    fetch(`http://${renderUrl}/${botUrl}`)
    .then((res) => res.text())
    .then(body => {
      res.set('Cache-Control', 'public, max-age=300, s-maxage=600')
      res.set('Vary', 'User-Agent')
      res.send(body.toString())
    })
  } else {
    console.log(`http://${appUrl}`)
    fetch(`http://${appUrl}`)
    .then((res) => res.text())
    .then(body => {
      console.log(body)
      res.send(body)
    })
  }
})

app.listen(8080, () => {
  console.log('node express server listening')
})
