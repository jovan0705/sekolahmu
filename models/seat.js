'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Seat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Seat.init({
    classId: {
      type: DataTypes.INTEGER,
      unique: {msg: 'Class already registered'},
      allowNull: false,
      validate: {
        notEmpty: {msg: 'Class cannot be empty'},
        notNull: {msg: 'Class cannot be empty'}
      }
    },
    seats: DataTypes.STRING,
    studentId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Seat',
  });
  return Seat;
};