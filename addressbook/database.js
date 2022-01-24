const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DB_SCHEMA || 'postgres', process.env.DB_USER || 'postgres', process.env.DB_PASSWORD || '', {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  dialect: 'postgres',
  dialectOptions: {
    ssl: process.env.DB_SSL == 'true',
  },
})

const Profile = sequelize.define(
  'Profile',
  {
    uuid: { type: Sequelize.UUID, primaryKey: true },
    mrn: { type: Sequelize.STRING },
    firstName: { type: Sequelize.STRING, allowNull: false },
    lastName: { type: Sequelize.STRING, allowNull: false },
    dob: { type: Sequelize.DATE },
    gender: { type: Sequelize.STRING },
    contactNo: { type: Sequelize.STRING },
    email: { type: Sequelize.STRING },
    isActive: { type: Sequelize.BOOLEAN },
  },
  {
    paranoid: true,
  }
)

const Address = sequelize.define('Address', {
  one: { type: Sequelize.STRING, allowNull: false },
  two: { type: Sequelize.STRING },
  postcode: { type: Sequelize.INTEGER },
  state: { type: Sequelize.STRING, allowNull: false },
  lat: { type: Sequelize.DECIMAL },
  lng: { type: Sequelize.DECIMAL },
})

// const NextOfKin = sequelize.define('NextOfKin', {
//   firstName: { type: Sequelize.STRING, allowNull: false },
//   lastName: { type: Sequelize.STRING, allowNull: false },
//   contactNo: { type: Sequelize.STRING, allowNull: false },
//   email: { type: Sequelize.STRING },
//   relationshop: { type: Sequelize.STRING, allowNull: false },
// })

// assoociations
Profile.Addresses = Profile.hasOne(Address)
Address.Profile = Address.belongsTo(Profile)
// Profile.hasMany(NextOfKin)

module.exports = {
  sequelize: sequelize,
  Profile: Profile,
  Address: Address,
}
