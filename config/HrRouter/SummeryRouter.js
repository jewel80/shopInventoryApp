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

}

module.exports.routerInit = routerInit;