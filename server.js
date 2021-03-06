require('dotenv').config()
const express = require('express')

const router = require('./src/routes')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors')

app.use(express.json())
app.use(cors())

app.use('/api/v1/', router)

app.use('/uploads', express.static('uploads'))

app.get("/", (request, response) => {
    response.json("Hello from server");
});

app.listen(port, () => console.log(`Listening on port ${port}!`))
