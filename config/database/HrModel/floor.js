const Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Floor_Table', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: 'uniqueFloorName',
        },
        code: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        warehouse_name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: 'uniqueFloorName',
        },
    }, {
        tableName: 'floor',
        underscored: true,
        timestamps: false,
    });
};