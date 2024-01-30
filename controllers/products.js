const { query } = require('express')
const Product = require('../models/product')


const getAllProductsStatic = async (req, res) => {

    const page = 1;
    const limit = 3;
    const skip = (page - 1) * limit;
    // const products = await Product.find({}).select('name price').limit(limit).skip(skip)

    //Quey operators test
    const products = await Product.find({ price: { $lt: 30 } }).sort('price');
    res.status(200).json({ products, nbHits: products.length })
}

const getAllProducts = async (req, res) => {
    const { featured, company, name, sort, fields, page, limit, numericFilters } = req.query

    var queryObj = {}

    if (featured) {
        queryObj.featured = featured === 'true' ? true : false;
    }

    if (name) {
        queryObj.name = { $regex: name, $options: 'i' }
    }

    if (company) {
        queryObj.company = company
    }


    //Numeric Filters
    if (numericFilters) {
        console.log(numericFilters);
        // price > 25
        const filtersList = numericFilters.split(',');

        const operatorMap = new Map([
            ['>', '$gt'],
            ['>=', '$gte'],
            ['<', '$lt'],
            ['<=', '$lte'],
            ['=', '$eq'],
        ]);

        const options = ['price', 'rating']

        filtersList.forEach(filter => {

            operatorMap.forEach((mop, op) => {

                if (filter.includes(op)) {

                    const [field, value] = filter.split(op);

                    if (options.includes(field)) {

                        queryObj[field] = { [mop]: Number(value) }

                    }

                }
            })

        });

        console.log(queryObj);

    }

    let result = Product.find(queryObj);

    //sort
    if (sort) {
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    } else {
        result = result.sort('createdAt')
    }

    //fields
    if (fields) {
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList)
    }


    if (page) {
        const pageValue = parseInt(page)
        const limitValue = parseInt(limit)
        const skip = (pageValue - 1) * limitValue;
        result = result.limit(limitValue).skip(skip)
    }

    const products = await result

    res.status(200).json({ products, nbHits: products.length })
}


module.exports = {
    getAllProducts,
    getAllProductsStatic
}


//
// if (numericFilters) {
//     console.log(numericFilters);
//     // price > 25
//     const filtersList = numericFilters.split(',');

//     const operatorMap = new Map([
//         ['>', '$gt'],
//         ['>=', '$gte'],
//         ['<', '$lt'],
//         ['<=', '$lte'],
//         ['=', '$eq'],
//     ]);

//     filtersList.forEach(filter => {

//         operatorMap.forEach((mop, op) => {
//             if (filter.includes(op)) {
//                 const filterValue = filter.split(op);
//                 const field = filterValue[0];
//                 const value = filterValue[1];
//                 queryObj = { ...queryObj, [field]: { [mop]: value } }

//             }
//         })

//     });

//     console.log(queryObj);

// }
