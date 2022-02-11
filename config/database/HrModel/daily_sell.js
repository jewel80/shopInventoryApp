const Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Daily_Sell_Table', {
        date: {
            type: Sequelize.DATE
        },
        item_code: {
            type: Sequelize.INTEGER,
            references: {
                model: "inv_product",
                key: "id"
            }
        },
        discount: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        expence_shop: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        remark: {
            type: Sequelize.STRING,
        }
    }, {
        tableName: 'daily_sell',
        underscored: true,
        timestamps: false,
    });
};