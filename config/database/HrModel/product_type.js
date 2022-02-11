const Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Product_Type_Table', {
        name: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true
        },
        description: {
            type: Sequelize.STRING,
        }
    }, {
        tableName: 'product_type',
        underscored: true,
        timestamps: false,
    });
};