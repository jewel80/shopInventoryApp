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
const upload = multer({
    dest: 'public/uploads/'
});
var monthShortCapsNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

function removeDuplicate(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}
global.dailyReportHead = function() {
    var dRH = '<head>' +
        '<style>' +
        'table, th, td {' +
        'border: 1px solid black;' +
        'border-collapse: collapse;' +
        '}' +
        'th, td {' +
        'padding: 6px;' +
        'line-height: 1;' +
        'align: center;' +
        '}' +
        'h1, h2, h3, h4, h5, h6 {' +
        'line-height: 0;' +
        'text-align: center;' +
        '}' +
        '#pageBody {' +
        'font-size: 9px;' +
        'padding: 6px 20px 6px 20px;' +
        'page-break-after: always;' +
        '}' +
        '#pageBody:last-child {' +
        'page-break-after: avoid;' +
        '}' +
        '</style>' +
        '</head>';
    return dRH;
}


global.headerContents = function() {
    var hC = '<div style="' +
        'color: #444;' +
        'font-size: 10px;' +
        'position: fixed;' +
        'top: 15;' +
        'right: 15;' +
        '">' +
        '<span>PRINT TIME: ' +
        new Date() +
        '</span>' +
        '</div>' +
        '<br />' +
        '<h3 style="' +
        'line-height: 0;' +
        '">' + 'VB Fashion House' + '</h3>';
    return hC;
}
global.footerContents = function() {
    var fC = '<div style="' +
        'color: #444;' +
        'font-size: 9px;' +
        'position: fixed;' +
        'bottom: 15;' +
        'right: 15;' +
        '">' +
        '<span>PAGE {{page}}</span>' +
        ' OUT OF ' +
        '<span>{{pages}}</span>' +
        '</div>';
    return fC;
}

function routerInit(app, dbFull) {
    var db = dbFull.HR_DB

    app.get('/getInvProductList', (req, res) => {
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

        if (QUERY.from_date != null && QUERY.to_date != null) {
            let f = moment(new Date(QUERY.from_date).toISOString());
            let t = moment(new Date(QUERY.to_date).toISOString());
            SEARCH.in_date = {};
            SEARCH.in_date = {
                [Op.between]: [f, t]
            };

        }

        db.inv_product.findAndCountAll({
            where: SEARCH,
            include: [{
                model: db.product_type,
            }],
            order: [
                ['in_date', 'DESC']
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

    app.get('/singleProductInventory/:DID', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        db.inv_product.findAll({
            where: {
                product_type: req.params.DID
            }
        }).then(rData => {
            res.send(rData);
        }).catch(e => {
            res.send([]);
        });
    });

    app.get('/getProductTypeComboList', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        db.inv_product.findAll({
            include: [{
                model: db.product_type,
            }]
        }).then(rData => {
            res.send(rData);
        }).catch(err => {
            res.send([]);
        })
    });



    app.post('/getInvProductList', function(req, res) {
        var QUERY = {};
        QUERY.id = req.body.id;
        QUERY.data = {};
        QUERY.data = req.body;
        delete QUERY.data.id;
        db.inv_product.update(QUERY.data, {
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
        db.inv_product.destroy({
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


    app.post('/CreateInvProduct', function(req, res) {
        var DATA = req.body;
        //New date create with format 
        var f = new Date();
        var newDate = (f.getFullYear()) + '-' + (f.getMonth() + 1) + '-' + f.getDate() + ' 00:00:00.0000000 +06:00';
        db.inv_product.create({
            product_type: DATA.product_type,
            item_name: DATA.item_name,
            item_code: DATA.item_code,
            buying_price: DATA.buying_price,
            buying_quantity: DATA.buying_quantity,
            selling_price: DATA.selling_price,
            sold_quantity: DATA.sold_quantity,
            discount: DATA.discount,
            in_date: newDate,
            remark: DATA.remark
        }).then(cB => {
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

    //==============////////===================//
    app.post('/XlUploadDuplicateRemove', upload.single('duplicate_data'), function(req, res) {
        var rawFile = req.file.path;
        var workbook = xlsx.readFile(rawFile, {
            cellDates: true
        });
        var sheet_name_list = workbook.SheetNames;
        var AllDatas = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        var Datas = removeDuplicate(AllDatas, 'KYC_SERIAL');
        if (Datas.length < 1001) {
            async.each(Datas, function(dt, cb_dt) {
                db.inv_product.findAll({
                    where: {
                        kyc_serial: dt.KYC_SERIAL
                    },
                }).then(aData => {
                    if (aData.length === 0) {
                        var o = {};
                        o.kyc_serial = dt.KYC_SERIAL;
                        o.box_no = dt.BOX_NO;
                        o.batch_no = dt.BATCH_NO;
                        o.operator = dt.OPERATOR ? dt.OPERATOR : "NULL";
                        o.date = new Date();
                        db.inv_product.create(o).then(aData => {
                            cb_dt();
                        }).catch(e => {
                            // cb_dt();
                            res.send('error');
                        })
                    } else {
                        cb_dt();
                    }
                }).catch(e => {
                    res.send('error');
                })
            }, function(err) {
                res.send("success");
            });
        } else {
            res.send('error');
        }
    });


    ///////==============////////===================///////////

    app.get('/getKycReportList', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        var returnData = {};
        returnData.count = 0;
        returnData.rows = [];
        var QUERY = (req.query) ? req.query : {};
        var Search = {};
        if (req.query.kyc_serial) {
            Search = {
                [Op.or]: [{
                    kyc_serial: {
                        [Op.like]: '%' + req.query.kyc_serial + '%'
                    }
                }]
            };
        }
        let limits = {};
        if (req.query.limit) {
            limits = {
                offset: (req.query.start) ? parseInt(req.query.start) : 0,
                limit: parseInt(req.query.limit)
            }
        }
        db.inv_product.findAndCountAll({
            where: Search,
            ...limits
        }).then(rData => {
            returnData.count = rData.count;
            async.each((rData.rows), function(kycData, cb_kyc) {
                var o = {};
                o.id = kycData.id;
                o.KycSerial = kycData.kyc_serial;
                o.BoxNo = kycData.box_no;
                o.BatchNo = kycData.batch_no;
                o.operator = kycData.operator;
                o.Date = kycData.date;
                o.Serial_no = '';
                o.Floor = '';
                o.Column = '';
                o.Train = '';
                o.Rack = '';
                o.Level = '';
                o.Side = '';
                db.box_archive.findAll({
                    where: {
                        box_no: kycData.box_no
                    },
                    include: [{
                        model: db.floor
                    }],
                }).then(boxData => {
                    for (var i = 0; i < boxData.length; i++) {
                        o.Serial_no += boxData[i].serial_no;
                        o.Floor += boxData[i].Floor_Table.name;
                        o.Column += boxData[i].column ? boxData[i].column : "";
                        o.Rack += boxData[i].rack ? boxData[i].rack : "";
                        o.Train += boxData[i].train ? boxData[i].train : "";
                        o.Level += boxData[i].level ? boxData[i].level : "";
                        o.Side += boxData[i].side ? boxData[i].side : "";
                    }
                    returnData.rows.push(o);
                    cb_kyc();
                })
            }, function(err) {
                returnData.rows.sort(function(a, b) {
                    var o1 = a.KycSerial;
                    var o2 = b.KycSerial;
                    var p1 = a.BoxNo;
                    var p2 = b.BoxNo;
                    if (o1 < o2) return -1;
                    if (o1 > o2) return 1;
                    if (p1 < p2) return -1;
                    if (p1 > p2) return 1;
                    return 0;
                });
                res.send(returnData);
            });
        }).catch(err => {
            res.send([]);
        })
    });

    app.post('/DownloadInvProductExcel', function(req, res) {
        var QUERY = (req.body) ? req.body : {},
            search_kyc = {};
        if (QUERY.box_no)
            search_kyc.box_no = {
                [Op.like]: "%" + QUERY.box_no + "%"
            };
        if (QUERY.operator)
            search_kyc.operator = {
                [Op.like]: "%" + QUERY.operator + "%"
            };
        var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
        var f = new Date(d);
        f.setDate(1);
        f.setHours(f.getHours() - 6);
        var t = new Date(d);
        t.setMonth(t.getMonth() + 1);
        t.setDate(0);
        t.setHours(t.getHours() - 6);
        if (QUERY.date) {
            search_kyc.date = {
                [Op.between]: [f, t]
            };
        }
        db.inv_product.findAll({
            where: search_kyc,
        }).then(rData => {
            var Datas = JSON.parse(JSON.stringify(rData));
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet('Customers');
            var returnData = [];

            for (var i = 0; i < Datas.length; i++) {
                var o = {};
                o.kyc_serial = Datas[i].kyc_serial;
                o.batch_no = Datas[i].batch_no;
                o.box_no = Datas[i].box_no;
                o.operator = Datas[i].operator;
                o.date = new Date(Datas[i].date);
                returnData.push(o);
            }
            //  WorkSheet Header
            worksheet.columns = [{
                header: 'KYC SERIAL',
                key: 'kyc_serial',
                width: 20
            }, {
                header: 'BATCH NO',
                key: 'batch_no',
                width: 14
            }, {
                header: 'BOX NO',
                key: 'box_no',
                width: 25
            }, {
                header: 'OPERATOR',
                key: 'operator',
                width: 20,
                outlineLevel: 1
            }, {
                header: 'DATE',
                key: 'date',
                width: 20,
                style: {
                    numFmt: 'dd/mm/yyyy'
                }
            }, ];

            worksheet.getRow(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: '47C379'
                }
            }

            worksheet.getRow(1).font = {
                    name: 'Arial',
                    size: 11
                }
                // Add Array Rows
            worksheet.addRows(returnData);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=' + 'DownloadInvProductExcel.xlsx');

            workbook.xlsx.writeFile('./public/excel/DownloadInvProductExcel.xlsx').then((err, resource) => {
                if (err) return console.log(err);
                res.send('success');
            });
        }).catch(e => {
            res.send('error');
        })
    });

    app.post('/DownloadInvProductPDF', function(req, res) {
        var QUERY = (req.body) ? req.body : {},
            search_kyc = {};
        if (QUERY.box_no)
            search_kyc.box_no = {
                [Op.like]: "%" + QUERY.box_no + "%"
            };
        if (QUERY.operator)
            search_kyc.operator = {
                [Op.like]: "%" + QUERY.operator + "%"
            };
        var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
        var f = new Date(d);
        f.setDate(1);
        f.setHours(f.getHours() - 6);
        var t = new Date(d);
        t.setMonth(t.getMonth() + 1);
        t.setDate(0);
        t.setHours(t.getHours() - 6);
        if (QUERY.date) {
            search_kyc.date = {
                [Op.between]: [f, t]
            };
        }
        db.inv_product.findAll({
            where: search_kyc,
        }).then(rData => {
            var Datas = JSON.parse(JSON.stringify(rData));

            var htmlData =
                '<!DOCTYPE html><body>' +
                dailyReportHead() +
                '<div id="pageBody">';

            htmlData += '<table style="width:100%">' +
                '<tr>' +
                '<th>KYC SERIAL</th>' +
                '<th>BATCH NO</th>' +
                '<th>BOX NO</th>' +
                '<th>OPERATOR</th>' +
                '<th>DATE</th>' +
                '</tr>';
            var tableRowHtml = '';
            for (var i = 0; i < Datas.length; i++) {
                var Dates = new Date(Datas[i].date) ? new Date(Datas[i].date) : 'NOT FOUND';

                var KYC_SERIAL = (Datas[i].kyc_serial) ? Datas[i].kyc_serial : 'NOT FOUND';
                var BATCH_NO = (Datas[i].batch_no) ? Datas[i].batch_no : 'NOT FOUND';
                var BOX_NO = (Datas[i].box_no) ? Datas[i].box_no : 'NOT FOUND';
                var OPERATOR = (Datas[i].operator) ? Datas[i].operator : 'NOT FOUND';
                tableRowHtml += '<tr>' +
                    '<td align="right">' + KYC_SERIAL + '</td>' +
                    '<td align="center">' + BATCH_NO + '</td>' +
                    '<td align="left">' + BOX_NO + '</td>' +
                    '<td align="left">' + OPERATOR + '</td>' +
                    '<td align="center">' + Dates.formatDate() + '</td>' +
                    '</tr>';
            }
            htmlData += tableRowHtml;
            options = {
                format: 'A4',
                orientation: "portrait",
                header: {
                    height: "30mm",
                    contents: headerContents() +
                        '<h5 style="' +
                        'line-height: 0;' +
                        '">KYC ARCHIVE REPORT</h5></br></br>'
                },
                footer: {
                    height: "15mm",
                    contents: footerContents()
                }
            };
            pdf.create(htmlData, options).toFile('./public/pdf/DownloadInvProductPDF.pdf', function(err, resource) {
                if (err) return console.log(err);
                res.send('success');
            });

        }).catch(e => {
            res.send('error');
        })
    });
}

module.exports.routerInit = routerInit;