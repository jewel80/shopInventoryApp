const Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Kyc_Archive_Table', {
        kyc_serial: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        box_no: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        batch_no: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        operator: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        date: {
            type: Sequelize.DATE,
            allowNull: true,
        },
    }, {
        tableName: 'kyc_archive',
        underscored: true,
        timestamps: false,
    });
};