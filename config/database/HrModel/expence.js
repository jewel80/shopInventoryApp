const Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Expence_Table', {
        date: {
            type: Sequelize.DATE
        },
        expence_money: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        remark: {
            type: Sequelize.STRING,
        }
    }, {
        tableName: 'expence',
        underscored: true,
        timestamps: false,
    });
};