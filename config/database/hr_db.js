function init(sequelize) {
    /////*******************#####   MODELER FILE INCLUDING STARTS  *#####****************/////

    this.user = require(__dirname + '/HrModel/user.js')(sequelize);
    this.role = require(__dirname + '/HrModel/role.js')(sequelize);
    this.navigation = require(__dirname + '/HrModel/navigation.js')(sequelize);
    this.user_navigation = require(__dirname + '/HrModel/user_navigation.js')(sequelize);


    this.product_type = require(__dirname + '/HrModel/product_type.js')(sequelize);
    this.inv_product = require(__dirname + '/HrModel/inv_product.js')(sequelize);
    this.sales = require(__dirname + '/HrModel/sales.js')(sequelize);
    this.expence = require(__dirname + '/HrModel/expence.js')(sequelize);

    /////*******************#####   MODELER FILE INCLUDING ENDS  #####****************/////


    ////////////////%%%%#####   TABLE RELATIONSHIP STARTS  #####%%%%////////////////////

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
    this.sales.belongsTo(this.inv_product, {
        foreignKey: 'products'
    });


    ////////////////%%%%#####   TABLE RELATIONSHIP ENDS  #####%%%%////////////////////
    sequelize.sync({
        force: false
    }).then(function(d) {
        if (!d) {
            console.log('An error occurred while creating the table:', d)
        } else {
            console.log('It worked!')
        }
    })
}

module.exports.init = init;