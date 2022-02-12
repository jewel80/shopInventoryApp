module.exports = function() {};
const fs = require('fs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const async = require('async');
const pdf = require('html-pdf');
const multer = require('multer');
const xlsx = require('xlsx');
const excel = require('exceljs');
const { setTimeout } = require('timers');
const upload = multer({
    dest: 'public/uploads/'
});
var monthShortCapsNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];


function routerInit(app, dbFull) {
    var db = dbFull.HR_DB

    app.get('/getSalesList', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        var QUERY = (req.query) ? req.query : {};
        var SEARCH = {};
        if (QUERY.product_type)
            SEARCH.product_type = QUERY.product_type;
        if (QUERY.item_name) {
            SEARCH = {
                item_name: {
                    [Op.like]: '%' + QUERY.item_name + '%'
                }
            };
        }
        
        if (QUERY.item_code) {
            SEARCH = {
                item_code: {
                    [Op.like]: '%' + QUERY.item_code + '%'
                }
            };
        }

        console.log(QUERY)

        console.log(SEARCH)
        db.sales.findAndCountAll({
            // where: SEARCH,
            include: [{
                model: db.inv_product,
            }],
            offset: (QUERY.start) ? parseInt(QUERY.start) : 0,
            limit: (QUERY.limit) ? parseInt(QUERY.limit) : null
        }).then(rData => {
            res.send(rData);
        }).catch(err => {
            console.log(err)
            res.send([]);
        })
    });


    app.get('/getProductTypeList', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        db.product_type.findAll().then(rData => {
            res.send(rData);
        }).catch(err => {
            res.send([]);
        })
    });



    app.post('/getSalesList', function(req, res) {
        var QUERY = {};
        QUERY.id = req.body.id;
        QUERY.data = {};
        QUERY.data = req.body;
        delete QUERY.data.id;
        db.sales.update(QUERY.data, {
            where: {
                id: QUERY.id
            }
        }).then(cB => {
            res.send(cB);
        }).catch(e => {
            res.send(e);
        })
    });

    app.post('/DestroyVillage', function(req, res) {
        db.sales.destroy({
            where: req.body
        }).then(function(state, up) {
            res.send('success');
        }).catch(e => {
            res.send('error');
        })
    });

    app.post('/CreateProductType', function(req, res) {
        var DATA = req.body;
        db.product_type.create({
            name: DATA.name,
            description: DATA.description
        }).then(cB => {
            res.send('Success');
        }).catch(e => {
            res.send('Error');
        })
    });


    app.post('/CreateSales', function(req, res) {
        var DATA = req.body;
        console.log('==========A============')
        console.log(DATA)
        console.log('==========B============')
        db.sales.create({
            // serial: DATA.serial,
            product_type: DATA.product_type,
            item_name: DATA.item_name,
            item_code: DATA.item_code,
            buying_price: DATA.buying_price,
            buying_quantity: DATA.buying_quantity,
            selling_price: DATA.selling_price,
            sold_quantity: DATA.sold_quantity,
            // remaining: DATA.remaining,
            discount: DATA.discount,
            in_date: new Date(),
            remark: DATA.remark,

            // date: new Date(),
        }).then(cB => {
            // console.log(cB);
            res.send('Success');
        }).catch(e => {
            console.log(e);
            res.send('Error');
        })
    });



    app.get('/getProductTypeList', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        db.product_type.findAll().then(rData => {
            res.send(rData);
        }).catch(err => {
            res.send([]);
        })
    });

}

module.exports.routerInit = routerInit;