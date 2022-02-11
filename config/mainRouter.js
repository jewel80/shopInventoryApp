module.exports = function() {};

function mainRouter(app, db, io) {

    

    const userRouter = require(__dirname + '/HrRouter/userRouter.js')
    const navigationRouter = require(__dirname + '/HrRouter/navigationRouter.js')
    
    const invProduct = require(__dirname + '/HrRouter/invProduct.js')



    
    userRouter.routerInit(app, db)
    navigationRouter.routerInit(app, db)
    invProduct.routerInit(app, db)


    io.on('connection', function(s) {
        userRouter.socketInit(db, s)
        navigationRouter.socketInit(db, s)
    })

    //////////////////// ACCOUNT ROUTER ENDS ///////////////////////
}

module.exports.mainRouter = mainRouter;