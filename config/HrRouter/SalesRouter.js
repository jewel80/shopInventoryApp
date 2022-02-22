module.exports = function() {};
const fs = require('fs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const async = require('async');
const pdf = require('html-pdf');
const multer = require('multer');
const xlsx = require('xlsx');
const excel = require('exceljs');
const moment = require('moment');
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

        if (QUERY.from_date != null && QUERY.to_date != null) {
            let f = moment(new Date(QUERY.from_date).toISOString());
            let t = moment(new Date(QUERY.to_date).toISOString());
            SEARCH.date = {};
            SEARCH.date = {
                [Op.between]: [f, t]
            };

        }

        db.sales.findAndCountAll({
            where: SEARCH,
            include: [{
                model: db.inv_product,
            }],
            order: [
                ['date', 'DESC']
            ],
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

    app.post('/DestroySalesProduct', function(req, res) {
        db.sales.findOne({
            where: {
                id: req.body.id
            },
            include: [{
                model: db.inv_product,
            }],
        }).then(rData => {
            var salesData = JSON.parse(JSON.stringify(rData));
            var CurrentQty = salesData.Inv_Product_Table.sold_quantity - salesData.quantity;
            db.inv_product.update({
                sold_quantity: CurrentQty
            }, {
                where: {
                    id: salesData.products
                }
            }).then(cB => {
                db.sales.destroy({
                    where: req.body
                }).then(function(state, up) {
                    res.send('success');
                }).catch(e => {
                    res.send('error');
                })
            }).catch(e => {
                res.send('Error');
            })

        }).catch(err => {
            console.log(err)
            res.send([]);
        })
    });


    app.post('/CreateSalesProduct', function(req, res) {
        var DATA = req.body;
        //New date create with format 
        var f = new Date();
        var newDate = (f.getFullYear()) + '-' + (f.getMonth() + 1) + '-' + f.getDate() + ' 00:00:00.0000000 +06:00';
        var totalPrice = (parseInt(DATA.SalesPrice) * parseInt(DATA.quantity)) - parseInt(DATA.discount);
        db.sales.create({
            products: DATA.product_item_code,
            item_name: DATA.item_name,
            item_code: DATA.ItemCode,
            sales_price: DATA.SalesPrice,
            quantity: DATA.quantity,
            memo_e_n: DATA.memo_en,
            discount: DATA.discount,
            total_price: totalPrice,
            date: DATA.date ? DATA.date : newDate,
            remark: DATA.remark ? DATA.remark : "N/A"
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