const Product = require('./models/product')

require('dotenv').config()

const connectDB = require('./db/connect')

const products = require('./products.json')

const populateData = async () => {

    await connectDB(process.env.MONGO_URI);

    try {
        await Product.insertMany(products);
        // await Product.deleteMany();
        console.log('successfully all added');

        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}


populateData()