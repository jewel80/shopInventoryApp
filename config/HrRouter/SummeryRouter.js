module.exports = function() {};
const fs = require('fs');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const async = require('async');
const pdf = require('html-pdf');
const multer = require('multer');
const xlsx = require('xlsx');
const excel = require('exceljs');
const moment = require('moment');


function routerInit(app, dbFull) {
    var db = dbFull.HR_DB 

    app.get('/getSummeryList', (req, res) => {
        res.setHeader('Content-Type', 'application/json');

        var QUERY = (req.query) ? req.query : {};


        var SEARCH = {};
        var D_SEARCH = {};

        if (QUERY.product_type)
            SEARCH.product_type = QUERY.product_type;

        if (QUERY.from_date != null && QUERY.to_date != null) {
            let f = moment(new Date(QUERY.from_date).toISOString());
            let t = moment(new Date(QUERY.to_date).toISOString());
            D_SEARCH.date = {};
            D_SEARCH.date = {
                [Op.between]: [f, t]
            };

        }
        db.sales.findAndCountAll({
            where: D_SEARCH,
            include: [{
                model: db.inv_product,
                where: SEARCH,
                include: [{
                    model: db.product_type
                }]
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



    app.get('/getAccountSummeryList', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        var returnData = [];
        var QUERY = (req.query) ? req.query : {};
        var SEARCH = {};
        var d = (QUERY.month) ? new Date(QUERY.month) : new Date();
        var f = new Date(d);
        f.setDate(1);
        f.setHours(f.getHours() - 6);
        var t = new Date(d);
        t.setMonth(t.getMonth() + 1);
        t.setDate(1);
        t.setHours(t.getHours() - 6);

        SEARCH.date = {
            [Op.between]: [f, t]
        };

        db.sales.findAll({
            where: SEARCH,
            attributes: ['id', 'date', 'quantity', 'total_price'],
            include: [{
                attributes: ['id', 'buying_price'],
                model: db.inv_product,
                include: [{
                    model: db.product_type
                }]
            }]
        }).then(rData => {
            var o = {};
            o.date = QUERY.month ? QUERY.month : d;
            o.quantity = 0;
            o.totalPrice = 0;
            o.buyingPrice = 0;
            o.expence = 0;

            for (var i = 0; i < rData.length; i++) {
                o.quantity += rData[i].quantity;
                o.totalPrice += rData[i].total_price;
                o.buyingPrice += rData[i].Inv_Product_Table.buying_price;
            }

            db.expence.findAll({
                where: SEARCH,
            }).then(eData => {
                for (var i = 0; i < eData.length; i++) {
                    o.expence += eData[i].expence_money;
                }
                res.send(o);
            }).catch(err => {
                res.send([]);
            })
        })
    });


    app.post('/DownloadSalesSummeryReportExcel', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        var returnData = [];
        var QUERY = (req.body) ? req.body : {};
        var SEARCH = {};
        var D_SEARCH = {};
        if (QUERY.product_type)
            SEARCH.product_type = QUERY.product_type;

        if (QUERY.from_date != null && QUERY.to_date != null) {
            let f = moment(new Date(QUERY.from_date).toISOString());
            let t = moment(new Date(QUERY.to_date).toISOString());
            D_SEARCH.date = {};
            D_SEARCH.date = {
                [Op.between]: [f, t]
            };

        }
        db.sales.findAll({
            where: D_SEARCH,
            include: [{
                model: db.inv_product,
                where: SEARCH,
                include: [{
                    model: db.product_type
                }]
            }],
            order: [
                ['date', 'DESC']
            ],
            offset: (QUERY.start) ? parseInt(QUERY.start) : 0,
            limit: (QUERY.limit) ? parseInt(QUERY.limit) : null
        }).then(rData => {
            async.each(rData, function(sData, cb_kyc) {
                try {
                    var buyCost = (parseInt(sData.Inv_Product_Table.buying_price) * parseInt(sData.quantity));
                    var salesPrice = parseInt(sData.total_price);
                    var o = {}
                    o.id = sData.id;
                    o.memo_e_n = sData.memo_e_n;
                    o.date = sData.date;
                    o.item_name = sData.item_name;
                    o.item_code = sData.item_code;
                    o.quantity = sData.quantity;
                    o.sales_price = sData.sales_price;
                    o.discount = sData.discount;
                    o.total_price = sData.total_price;
                    o.profit = salesPrice - buyCost;
                    o.remark = sData.remark;
                } catch (err) {
                    console.log(err);
                }
                returnData.push(o);
                cb_kyc();
            }, function(err) {
                let workbook = new excel.Workbook();
                let worksheet = workbook.addWorksheet('Customers');
                var filename = './public/excel/DownloadSalesSummeryReportExcel.xlsx';
                worksheet.columns = [{
                    header: 'MEMO E.N',
                    key: 'memo_e_n',
                    width: 15
                }, {
                    header: 'DATE',
                    key: 'date',
                    width: 20,
                    style: {
                        numFmt: 'dd-mm-yyyy'
                    }
                }, {
                    header: 'ITEM NAME',
                    key: 'item_name',
                    width: 25,
                }, {
                    header: 'ITEM CODE',
                    key: 'item_code',
                    width: 25,
                }, {
                    header: 'SALES QTY',
                    key: 'quantity',
                    width: 25

                }, {
                    header: 'SALES RATE',
                    key: 'sales_price',
                    width: 25,
                }, {
                    header: 'DISCOUNT',
                    key: 'discount',
                    width: 25,
                }, {
                    header: 'TOTAL SALES',
                    key: 'total_price',
                    width: 25,
                }, {
                    header: 'PROFIT',
                    key: 'profit',
                    width: 20,
                }, {
                    header: 'REMARKS',
                    key: 'remark',
                    width: 25,
                }];

                worksheet.getRow(1).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: {
                        argb: '47C379'
                    }
                }
                worksheet.getRow(1).font = {
                    name: 'Calibri',
                    size: 11
                }
                worksheet.addRows(returnData);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', 'attachment; filename=' + 'DownloadSalesSummeryReportExcel.xlsx');
                workbook.xlsx.writeFile(filename).then((err, resource) => {
                    if (err) return console.log(err);
                    res.send('success');
                });
            });
        }).catch(err => {
            res.send([]);
        })
    });

}

module.exports.routerInit = routerInit;