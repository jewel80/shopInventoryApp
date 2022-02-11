function init(sequelize) {
    /////*******************#####  RIPS MODELER FILE INCLUDING STARTS  *#####****************/////

    this.user = require(__dirname + '/HrModel/user.js')(sequelize);

    this.floor = require(__dirname + '/HrModel/floor.js')(sequelize);
    this.kyc_archive = require(__dirname + '/HrModel/kyc_archive.js')(sequelize);
    this.role = require(__dirname + '/HrModel/role.js')(sequelize);
    this.navigation = require(__dirname + '/HrModel/navigation.js')(sequelize);
    this.user_navigation = require(__dirname + '/HrModel/user_navigation.js')(sequelize);


    this.product_type = require(__dirname + '/HrModel/product_type.js')(sequelize);
    this.inv_product = require(__dirname + '/HrModel/inv_product.js')(sequelize);
    this.daily_sell = require(__dirname + '/HrModel/daily_sell.js')(sequelize);
    this.accounts = require(__dirname + '/HrModel/accounts.js')(sequelize);

    /////*******************#####  RIPS MODELER FILE INCLUDING ENDS  #####****************/////


    ////////////////%%%%#####  RIPS TABLE RELATIONSHIP STARTS  #####%%%%////////////////////

    /*=========================================================================================================
    =========================================================================================================
    =========================================================================================================*/

    
    this.navigation.belongsTo(this.navigation, {
        foreignKey: 'parent',
        as: 'Parent_Table'
    })
    this.user_navigation.belongsTo(this.user, {
        foreignKey: 'user'
    })
    this.user_navigation.belongsTo(this.navigation, {
        foreignKey: 'navigation'
    })
    this.user_navigation.belongsTo(this.role, {
        foreignKey: 'role'
    })



    this.inv_product.belongsTo(this.product_type, {
        foreignKey: 'product_type'
    });
    this.daily_sell.belongsTo(this.inv_product, {
        foreignKey: 'item_code'
    });


    ////////////////%%%%#####  RIPS TABLE RELATIONSHIP ENDS  #####%%%%////////////////////
    sequelize.sync({
        force: true
    }).then(function(d) {
        if (!d) {
            console.log('An error occurred while creating the table:', d)
        } else {
            console.log('It worked!')
        }
    })
}

module.exports.init = init;