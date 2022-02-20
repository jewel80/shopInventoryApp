module.exports = function() {};

function mainRouter(app, db, io) {

    
    

    const userRouter = require(__dirname + '/HrRouter/userRouter.js')
    const navigationRouter = require(__dirname + '/HrRouter/navigationRouter.js')
    
    const ProductRouter = require(__dirname + '/HrRouter/ProductRouter.js')
    const SalesRouter = require(__dirname + '/HrRouter/SalesRouter.js')



    
    userRouter.routerInit(app, db)
    navigationRouter.routerInit(app, db)
    ProductRouter.routerInit(app, db)
    SalesRouter.routerInit(app, db)


    io.on('connection', function(s) {
        userRouter.socketInit(db, s)
        navigationRouter.socketInit(db, s)
    })

    //////////////////// ACCOUNT ROUTER ENDS ///////////////////////
}

module.exports.mainRouter = mainRouter;
