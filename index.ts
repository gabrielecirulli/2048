import * as express from 'express'
import * as  path from 'path'

const app:express.Application = express()
const port = 3000;

app.use('/style',express.static('style'))
app.use('/js',express.static('dist/src'))
app.get('/', (req:express.Request, res:express.Response) => {
  return req && res.sendFile(path.join(__dirname + '/index.html'))
})

app.listen(port)
