import * as express from 'express'
import * as  path from 'path'

const app:express.Application = express()
const port = 3000;

app.use('/style',express.static('style'))
<<<<<<< HEAD
app.use('/js',express.static('dist/src'))
=======
app.use('/js',express.static('js'))
>>>>>>> 600042b34ca93a0fc951936adf6950a4637620c6
app.get('/', (req:express.Request, res:express.Response) => {
  return req && res.sendFile(path.join(__dirname + '/index.html'))
})

app.listen(port)
