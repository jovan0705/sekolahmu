'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Class.hasMany(models.Seat, {as: 'available_seats', foreignKey: 'classId'})
      Class.hasMany(models.Seat, {as: 'occupied_seats', foreignKey: 'classId'})
      // Class.hasMany(models.Seat, {foreignKey: 'classId'})
      // define association here
    }
  }
  Class.init({
    rows: DataTypes.INTEGER,
    columns: DataTypes.INTEGER,
    teacherId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Class',
  });
  return Class;
};