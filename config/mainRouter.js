module.exports = function() {};

function mainRouter(app, db, io) {

    const kycArchive = require(__dirname + '/HrRouter/kycArchive.js')
    const boxArchive = require(__dirname + '/HrRouter/boxArchive.js')
    const floor = require(__dirname + '/HrRouter/floor.js')
    const kycReport = require(__dirname + '/HrRouter/kycReport.js')
    const userRouter = require(__dirname + '/HrRouter/userRouter.js')
    const navigationRouter = require(__dirname + '/HrRouter/navigationRouter.js')
    
    const invProduct = require(__dirname + '/HrRouter/invProduct.js')



    floor.routerInit(app, db)
    boxArchive.routerInit(app, db)
    kycArchive.routerInit(app, db)
    kycReport.routerInit(app, db)
    userRouter.routerInit(app, db)
    navigationRouter.routerInit(app, db)
    invProduct.routerInit(app, db)


    io.on('connection', function(s) {
        //kycArchive.socketInit(db, s)
        userRouter.socketInit(db, s)
        navigationRouter.socketInit(db, s)
    })

    //////////////////// ACCOUNT ROUTER ENDS ///////////////////////
}

module.exports.mainRouter = mainRouter;