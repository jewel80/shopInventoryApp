const Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Inv_Product_Table', {
        product_type: {
            type: Sequelize.INTEGER,
            references: {
                model: "product_type",
                key: "id"
            }
        },
        item_name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        item_code: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        buying_price: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        buying_quantity: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        selling_price: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        sold_quantity: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        remaining: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        discount: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        in_date: {
            type: Sequelize.DATE
        },
        remark: {
            type: Sequelize.STRING,
        }
    }, {
        tableName: 'inv_product',
        underscored: true,
        timestamps: false,
    });
};