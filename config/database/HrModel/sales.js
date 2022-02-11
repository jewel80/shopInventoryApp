const Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Sales_Table', {
        date: {
            type: Sequelize.DATE
        },
        products: {
            type: Sequelize.INTEGER,
            references: {
                model: "inv_product",
                key: "id"
            }
        },
        item_name: {
            type: Sequelize.STRING,
        },
        item_code: {
            type: Sequelize.STRING,
        },
        sales_price: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        quantity: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        discount: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        total_price: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        remark: {
            type: Sequelize.STRING,
        }
    }, {
        tableName: 'sales',
        // underscored: true,
        // timestamps: false,
    });
};