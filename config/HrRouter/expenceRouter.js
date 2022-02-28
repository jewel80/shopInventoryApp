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

function routerInit(app, dbFull) {
    var db = dbFull.HR_DB

    app.get('/getExpenceList', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        var QUERY = (req.query) ? req.query : {};
        var SEARCH = {};
        if (QUERY.from_date != null && QUERY.to_date != null) {
            let f = moment(new Date(QUERY.from_date).toISOString());
            let t = moment(new Date(QUERY.to_date).toISOString());
            SEARCH.date = {};
            SEARCH.date = {
                [Op.between]: [f, t]
            };
        }

        db.expence.findAndCountAll({
            where: SEARCH,
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


    app.post('/getExpenceList', function(req, res) {
        var QUERY = {};
        QUERY.id = req.body.id;
        QUERY.data = {};
        QUERY.data = req.body;
        delete QUERY.data.id;
        db.expence.update(QUERY.data, {
            where: {
                id: QUERY.id
            }
        }).then(cB => {
            res.send(cB);
        }).catch(e => {
            res.send(e);
        })
    });

    app.post('/DestroyExpence', function(req, res) {
        db.expence.destroy({
            where: req.body
        }).then(function(state, up) {
            res.send('success');
        }).catch(e => {
            res.send('error');
        })
    });

    app.post('/CreateExpence', function(req, res) {
        var DATA = req.body;
        console.log(DATA);
        db.expence.create({
            expence_money: DATA.expence_money,
            date: DATA.date,
            remark: DATA.remarks
        }).then(cB => {
            res.send('Success');
        }).catch(e => {
            res.send('Error');
        })
    });

}

module.exports.routerInit = routerInit;