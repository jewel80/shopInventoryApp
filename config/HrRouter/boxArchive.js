module.exports = function() {};
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const async = require('async');
const pdf = require('html-pdf');


function routerInit(app, dbFull) {
    var db = dbFull.HR_DB

    app.get('/getKycArchiveListDatas', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        var urArr = [];
        db.box_archive.findAll().then(urData => {
            async.each(urData, function(ur, cb_urD) {
                urArr.push(ur.box_no)
                cb_urD()
            }, function(err) {
                db.kyc_archive.findAll({
                    where: {
                        box_no: {
                            [Op.notIn]: urArr
                        }
                    },
                    attributes: ['box_no'],
                    group: 'box_no',
                }).then(rData => {
                    res.send(rData);
                }).catch(err => {
                    res.send(err)
                })
            })
        })
    });

    app.get('/getBoxArchiveList', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        var QUERY = (req.query) ? req.query : {};
        var Search = {};
        if (QUERY.serial_no) {
            Search = {
                [Op.or]: [{
                    serial_no: {
                        [Op.like]: '%' + QUERY.serial_no + '%'
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
        db.box_archive.findAndCountAll({
            where: Search,
            include: [{
                model: db.floor
            }],
            ...limits
        }).then(rData => {
            res.send(rData);
        }).catch(err => {
            res.send([]);
        })
    });

    app.get('/getSupplieList', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        db.box_archive.findAll({
            include: [{
                model: db.floor
            }]
        }).then(rData => {
            res.send(rData);
        }).catch(err => {
            res.send([]);
        })
    });

    app.post('/getBoxArchiveList', function(req, res) {
        var QUERY = {};
        QUERY.id = req.body.id;
        QUERY.data = {};
        QUERY.data = req.body;
        delete QUERY.data.id;
        db.box_archive.update(QUERY.data, {
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
        db.box_archive.destroy({
            where: req.body
        }).then(function(state, up) {
            res.send('success');
        }).catch(e => {
            res.send('error');
        })
    });

    app.post('/CreateBoxArchive', function(req, res) {
        var DATA = req.body;
        if (DATA.box_no.length > 0) {
            var createBulkBox = [];
            for (var i = 0; i < DATA.box_no.length; i++) {
                var new_arr = {
                    serial_no: DATA.serial_no,
                    box_no: DATA.box_no[i] ? DATA.box_no[i] : DATA.box_no,
                    floor: DATA.floor,
                    column: DATA.column,
                    rack: DATA.rack,
                    train: DATA.train,
                    level: DATA.level,
                    side: DATA.side,
                };
                createBulkBox.push(new_arr);
            }
            db.box_archive.bulkCreate(createBulkBox).then(cB => {
                res.send('Success');
            }).catch(e => {
                res.send('Error');
            })
        } else {
            res.send('Error');
        }
    });
}
module.exports.routerInit = routerInit;









