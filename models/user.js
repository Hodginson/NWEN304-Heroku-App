var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');

// create a sequelize instance with our local postgres database information.
var sequelize = new Sequelize('postgres://tlytmbyzzcydfw:113545f7066f32de88f12a258e21e6b35647288147ebb4062332187c065ec1d4@ec2-174-129-194-188.compute-1.amazonaws.com:5432/dcadl9s1e5frsb');

// setup User model and its fields.
var User = sequelize.define('users', {
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    productsViewed: {
        type: Sequelize.ARRAY(Sequelize.BIGINT),
        allowNull: true
    },
    cart: {
        type: Sequelize.ARRAY(Sequelize.BIGINT),
        allowNull: true
    },
    purchases: {
        type: Sequelize.ARRAY(Sequelize.BIGINT),
        allowNull: true
    },
    Admin: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    }

}, {
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);
      }
    },

});

User.prototype.validPassword= function(password) {
  return bcrypt.compareSync(password, this.password);
}//

// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('users table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

// export User model for use in other files.
module.exports = User;
