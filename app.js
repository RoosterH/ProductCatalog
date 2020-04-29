const express = require('express');
const bodyParser = require('body-parser');
const mongojs = require('mongojs');
const cors = require('cors');

// connecting with DB, first param is the name of the db, 2nd param is // the array of the collections we will be using
const db = mongojs('catalog', ['products']);
const app = express();
const PORT = 3000;
const corsOptions = {
    origin: 'localhost',
    optionsSuccessStatus: 200 
}

// use middleware
app.use(bodyParser.json());

app.listen(PORT, () => {
    console.log(`Server is listening to port ${PORT}`);
});

app.get('/', cors(corsOptions), (req, res, next) => {
    // send back to browser
    res.send('Please use /api/v1/products/');
});

// use v1 for different version of API
app.get('/api/v1/products/', cors(corsOptions), (req, res, next) => {
    db.products.find((err, docs) => {
        if (err) {
            res.send(err);
            return;
        }
        console.log('Product Found...');
        res.json(docs);
    });
});

app.get('/api/v1/products/:id', cors(corsOptions), (req, res, next) => {
    db.products.findOne({_id: mongojs.ObjectID(req.params.id)}, (err, doc) => {
        if (err) {
            res.send(err);
            return;
        }
        console.log(`Product ${req.params.id} found...`);
        res.json(doc);
    });
});

// add product
app.post('/api/v1/products/', cors(corsOptions), (req, res, next) => {
    db.products.insert(req.body, (err, doc) => {
        if (err) {
            res.send(err);
            return;
        }
        console.log('Adding a product');
        res.json(doc);
    })
});

// Update a product
app.put('/api/v1/products/:id', cors(corsOptions), (req, res, next) => {
    // findAndModify https://docs.mongodb.com/manual/reference/command/findAndModify/
    // query _id
    // update certain fields using $set
    // new: true meaning if it's not found in db, we add it as a new product
    db.products.findAndModify({query: {_id: mongojs.ObjectId(req.  params.id)},
        update:{
            $set:{
                name: req.body.name,
                category: req.body.category,
                price: req.body.price
            }
        }, 
        new: true }, (err, doc) => {
            if (err) {
                res.send(err);
                return;
            }
            console.log('Updating a product...');
            res.json(doc);
        }
    )
});

// delete a product
app.delete('/api/v1/products/:id', cors(corsOptions), (req, res, next) => {
    db.products.remove({_id: mongojs.ObjectID(req.params.id)}, (err, doc) => {
        if (err) {
            res.send(err);
            return;
        }
        console.log('Removing a product...');
        res.json(doc);
    })
});