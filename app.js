const express = require('express')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 3000
const router = require('./router')

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())

app.use('/', router)

app.listen(PORT, () => {
    console.log(`app listening to http://localhost:${PORT}`)
})