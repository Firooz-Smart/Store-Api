require('dotenv').config()

const express = require('express')

require('express-async-errors')

const app = express()

const connectDB = require('./db/connect')

const errorHandleMiddleware = require('./middleware/error-handler')

const notFoundMiddleware = require('./middleware/not-found')


const productsRoute = require('./routes/products')

//middlewares
app.use(express.json())

//routes

app.use('/api/v1/products', productsRoute)

app.use(errorHandleMiddleware)
app.use(notFoundMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(3000, console.log(`Server is listening on port ${port} ...`))
    } catch (error) {
        console.log(error)
    }
}


start()