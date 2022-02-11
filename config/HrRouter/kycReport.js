module.exports = function() {};
const fs = require('fs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const async = require('async');
const pdf = require('html-pdf');
const multer = require('multer');
const xlsx = require('xlsx');
const excel = require('exceljs');
const upload = multer({
    dest: 'public/uploads/'
});

var monthShortCapsNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];
Date.prototype.formatDate = function() {
    var d = new Date(this)
    return addLeadingZero(2, d.getDate()) + '-' + monthShortCapsNames[d.getMonth()] + '-' + d.getFullYear();
};

function addLeadingZero(length, str) {
    var returnString = str.toString();
    var l = length - returnString.length;
    var zero = '';
    while (l > 0) {
        zero += '0';
        l--
    }
    return zero + returnString;
}

function htmlHeader() {
    var dRH = '<head>' +
        '<style>' +
        'table, th, td {' +
        'border: 1px solid black;' +
        'border-collapse: collapse;' +
        '}' +
        'th, td {' +
        'padding: 3px;' +
        'line-height: 1.5;' +
        'align: center;' +
        '}' +
        'h1, h2, h3, h4, h5, h6 {' +
        'line-height: 1;' +
        'text-align: center;' +
        '}' +
        '#pageBody {' +
        'font-size: 7px;' +
        'padding: 0px 10px 0px 10px;' +
        'page-break-after: always;' +
        '}' +
        '#pageBody:last-child {' +
        'page-break-after: avoid;' +
        '}' +
        'body {' +
        'font-family: Arial, Helvetica, sans-serif;' +
        '}' +
        '</style>' +
        '</head>';
    return dRH;
}

function routerInit(app, dbFull) {
    var db = dbFull.HR_DB

    app.get('/getFloorNoList', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        db.floor.findAll().then(rData => {
            res.send(rData);
        }).catch(err => {
            res.send([]);
        })
    });

    app.post('/DownloadKYCReportExcel', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        var returnData = [];
        var QUERY = (req.body) ? req.body : {};
        var Search = {};
        if (QUERY.kyc_serial) {
            Search = {
                [Op.or]: [{
                    kyc_serial: {
                        [Op.like]: '%' + QUERY.kyc_serial + '%'
                    }
                }]
            };
        }
        db.kyc_archive.findAll({
            where: Search,
        }).then(rData => {
            async.each(rData, function(kycData, cb_kyc) {
                var o = {};
                o.id = kycData.id;
                o.KycSerial = kycData.kyc_serial;
                o.BoxNo = kycData.box_no;
                o.BatchNo = kycData.batch_no;
                o.operator = kycData.operator ? kycData.operator : '';
                o.Date = new Date(kycData.date);
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
                    returnData.push(o);
                    cb_kyc();
                })
            }, function(err) {
                let workbook = new excel.Workbook();
                let worksheet = workbook.addWorksheet('Customers');
                var filename = './public/excel/DownloadKYCReportExcel.xlsx';

                worksheet.columns = [{
                    header: 'KYC SERIAL',
                    key: 'KycSerial',
                    width: 15
                }, {
                    header: 'BATCH NO',
                    key: 'BatchNo',
                    width: 13
                }, {
                    header: 'BOX NO',
                    key: 'BoxNo',
                    width: 25,
                }, {
                    header: 'OPERATOR',
                    key: 'operator',
                    width: 20,
                }, {
                    header: 'DATE',
                    key: 'Date',
                    width: 20,
                    style: {
                        numFmt: 'dd/mm/yyyy'
                    }
                }, {
                    header: 'SERIAL NO',
                    key: 'Serial_no',
                    width: 15,
                }, {
                    header: 'FLOOR',
                    key: 'Floor',
                    width: 10,
                }, {
                    header: 'COLUMN',
                    key: 'Column',
                    width: 10,
                }, {
                    header: 'TRAIN',
                    key: 'Train',
                    width: 10,
                }, {
                    header: 'RACK',
                    key: 'Rack',
                    width: 10,
                }, {
                    header: 'LEVEL',
                    key: 'Level',
                    width: 10,
                }, {
                    header: 'SIDE',
                    key: 'Side',
                    width: 10,
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
                worksheet.addRows(returnData);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', 'attachment; filename=' + 'DownloadKYCReportExcel.xlsx');
                workbook.xlsx.writeFile(filename).then((err, resource) => {
                    if (err) return console.log(err);
                    res.send('success');
                });

            });
        })
    });

    app.post('/PrintKycArchiveSingleData', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        var returnData = [];
        var QUERY = (req.body) ? req.body : {};
        var Search = {};
        if (QUERY.kyc_serial) {
            Search = {
                [Op.or]: [{
                    kyc_serial: {
                        [Op.like]: '%' + QUERY.kyc_serial + '%'
                    }
                }]
            };
        }
        db.kyc_archive.findAll({
            where: Search,
        }).then(rData => {
            async.each(rData, function(kycData, cb_kyc) {
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
                    returnData.push(o);
                    cb_kyc();
                })
            }, function(err) {
                var options = {
                    format: 'A4',
                    orientation: "landscape",
                };

                var htmlData =
                    '<!DOCTYPE html><body>' +
                    dailyReportHead() +
                    '<div id="pageBody">';

                htmlData += '<table style="width:100%">' +
                    '<tr>' +
                    '<th> KYC SERIAL </th>' +
                    '<th> BOX NO </th>' +
                    '<th> BATCH NO </th>' +
                    '<th> OPERATOR </th>' +
                    '<th> DATE </th>' +
                    '<th> SERIAL NO </th>' +
                    '<th> FLOOR </th>' +
                    '<th> COLUMN </th>' +
                    '<th> TRAIN </th>' +
                    '<th> RACK </th>' +
                    '<th> LEVEL </th>' +
                    '<th> SIDE </th>' +
                    '</tr>';
                var tableRowHtml = '';
                var total_value = 0;
                var total_quantity = 0;
                for (var i = 0; i < returnData.length; i++) {
                    var date = new Date(returnData[i].Date);

                    tableRowHtml += '<tr>' +
                        '<td align="left">' + returnData[i].KycSerial + '</td>' +
                        '<td align="left">' + returnData[i].BoxNo + '</td>' +
                        '<td align="center">' + returnData[i].BatchNo + '</td>' +
                        '<td align="left">' + returnData[i].operator + '</td>' +
                        '<td align="center">' + date.formatDate() + '</td>' +
                        '<td align="left">' + returnData[i].Serial_no + '</td>' +
                        '<td align="center">' + returnData[i].Floor + '</td>' +
                        '<td align="right">' + returnData[i].Column + '</td>' +
                        '<td align="right">' + returnData[i].Train + '</td>' +
                        '<td align="right">' + returnData[i].Rack + '</td>' +
                        '<td align="right">' + returnData[i].Level + '</td>' +
                        '<td align="right">' + returnData[i].Side + '</td>' +
                        '</tr>';
                }

                htmlData += tableRowHtml;
                options = {
                    format: 'A4',
                    orientation: "landscape",
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


                pdf.create(htmlData, options).toFile('./public/pdf/PrintKycArchiveSingleData.pdf', function(err, resource) {
                    if (err) return console.log(err);
                    res.send('success');
                });
            });
        })
    });

    app.post('/KYCArchiveMultipleSearch', upload.single('multiple_search'), function(req, res) {
        var rawFile = req.file.path;
        var workbook = xlsx.readFile(rawFile, {
            cellDates: true
        });
        var sheet_name_list = workbook.SheetNames;
        var xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        var searchData = [];
        for (var i = 0; i < xlData.length; i++) {
            searchData.push(xlData[i])
        }
        var returnData = []
        async.each(searchData, function(sData, cb_ba) {
            db.kyc_archive.findAll({
                where: {
                    kyc_serial: sData.KYC_SERIAL
                },
            }).then(rData => {
                async.each(rData, function(kycData, cb_kyc) {
                    var o = {};
                    o.id = kycData.id;
                    o.KycSerial = kycData.kyc_serial;
                    o.BoxNo = kycData.box_no;
                    o.BatchNo = kycData.batch_no;
                    o.operator = kycData.operator ? kycData.operator : '';
                    o.Date = new Date(kycData.date);
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
                        returnData.push(o);
                        cb_kyc();
                    })
                }, function(err) {
                    cb_ba();
                });
            })
        }, function(err) {
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet('Customers');
            var filename = './public/excel/KYCArchiveMultipleSearch.xlsx';

            // Add Header Columns
            worksheet.columns = [{
                header: 'KYC SERIAL',
                key: 'KycSerial',
                width: 15
            }, {
                header: 'BATCH NO',
                key: 'BatchNo',
                width: 13
            }, {
                header: 'BOX NO',
                key: 'BoxNo',
                width: 25,
            }, {
                header: 'OPERATOR',
                key: 'operator',
                width: 20,
            }, {
                header: 'DATE',
                key: 'Date',
                width: 20,
                style: {
                    numFmt: 'dd/mm/yyyy'
                }
            }, {
                header: 'SERIAL NO',
                key: 'Serial_no',
                width: 15,
            }, {
                header: 'FLOOR',
                key: 'Floor',
                width: 10,
            }, {
                header: 'COLUMN',
                key: 'Column',
                width: 10,
            }, {
                header: 'TRAIN',
                key: 'Train',
                width: 10,
            }, {
                header: 'RACK',
                key: 'Rack',
                width: 10,
            }, {
                header: 'LEVEL',
                key: 'Level',
                width: 10,
            }, {
                header: 'SIDE',
                key: 'Side',
                width: 10,
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
            res.setHeader('Content-Disposition', 'attachment; filename=' + 'KYCArchiveMultipleSearch.xlsx');
            workbook.xlsx.writeFile(filename).then(function() {
                res.download(filename, function(err) {
                    console.log('---------- If Error occurre, : ' + err);
                });
            });
        });
    });

}
module.exports.routerInit = routerInit;