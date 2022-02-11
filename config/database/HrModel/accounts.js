const Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Accounts_Table', {
        date: {
            type: Sequelize.DATE
        },
        cash_in_hand: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        cash_sent_dhaka: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        remark: {
            type: Sequelize.STRING,
        }
    }, {
        tableName: 'accounts',
        underscored: true,
        timestamps: false,
    });
};