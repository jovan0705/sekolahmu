'use strict';
const {
  Model
} = require('sequelize');
const { makePassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: 'Name cannot be empty'},
        notNull: {msg: 'Name cannot be empty'}
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {msg: 'Email already registered'},
      validate: {
        notEmpty: {msg: 'Email cannot be empty'},
        notNull: {msg: 'Email cannot be empty'}
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: 'Password cannot be empty'},
        notNull: {msg: 'Password cannot be empty'}
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: 'Role cannot be empty'},
        notNull: {msg: 'Role cannot be empty'}
      }
    }
  }, {
    hooks: {beforeCreate: (User) => {
      return User.password = makePassword(User.password)
    }},
    sequelize,
    modelName: 'User',
  });
  return User;
};