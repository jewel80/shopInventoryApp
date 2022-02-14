module.exports = function() {};
const fs = require('fs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const async = require('async');
const pdf = require('html-pdf');
const multer = require('multer');
const xlsx = require('xlsx');
const excel = require('exceljs');
const {
    setTimeout
} = require('timers');
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


    app.post('/CreateSalesProduct', function(req, res) {
        var DATA = req.body;
        var totalPrice = (DATA.sales_price * DATA.quantity) - DATA.discount;
        db.sales.create({
            products: DATA.product_item_code,
            item_name: DATA.item_name,
            item_code: DATA.item_code,
            sales_price: DATA.sales_price,
            quantity: DATA.quantity,
            discount: DATA.discount,
            total_price: totalPrice,
            date: DATA.date ? DATA.date : new Date(),
            remark: DATA.remark
        }).then(cB => {
            db.inv_product.findOne({
                where: {
                    id: DATA.product_item_code
                }
            }).then(rData => {
                var data = JSON.parse(JSON.stringify(rData))
                var BefoureQty = parseInt(data.sold_quantity);
                var SaleQty = parseInt(DATA.quantity);
                var totalSoldQty = BefoureQty + SaleQty;
                db.inv_product.update({
                    sold_quantity: totalSoldQty
                }, {
                    where: {
                        id: DATA.product_item_code
                    }
                }).then(cB => {
                    res.send('Success');
                }).catch(e => {
                    res.send('Error');
                })
            }).catch(e => {
                res.send('Error');
            })
        }).catch(e => {
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