module.exports = function() {};
const Sequelize = require('sequelize');
const async = require('async');
const Op = Sequelize.Op;

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

    app.get('/getFloorNameList', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        var returnData = [];
        db.floor.findAll().then(rData => {
            async.each(rData, function(emp, cb_data) {
                var o = {};
                o.id = emp.id;
                o.name = emp.name + ' - ' + emp.warehouse_name;
                returnData.push(o);
                cb_data();
            }, function(err) {
                res.send(returnData);
            });
        })
    });

    app.post('/getFloorNoList', function(req, res) {
        var QUERY = {};
        QUERY.id = req.body.id;
        QUERY.data = {};
        QUERY.data = req.body;
        delete QUERY.data.id;
        db.floor.update(QUERY.data, {
            where: {
                id: QUERY.id
            }
        }).then(cB => {
            res.send(cB);
        }).catch(e => {
            res.send(e);
        })
    });

    app.post('/DestroyFloor', function(req, res) {
        db.floor.destroy({
            where: req.body
        }).then(function(state, up) {
            res.send('success');
        }).catch(e => {
            res.send('error');
        })
    });

    app.post('/CreateFloor', function(req, res) {
        var DATA = req.body;
        db.floor.create({
            name: DATA.name,
            code: DATA.code,
            warehouse_name: DATA.warehouse_name,
        }).then(cB => {
            res.send('Success');
        }).catch(e => {
            res.send('Error');
        })
    });
}
module.exports.routerInit = routerInit;