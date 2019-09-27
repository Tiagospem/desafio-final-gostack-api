import Sequelize, { Model } from 'sequelize'

class Meetup extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: Sequelize.STRING,
        banner_id: Sequelize.INTEGER,
        title: Sequelize.STRING,
        description: Sequelize.TEXT,
        location: Sequelize.STRING,
        date: Sequelize.DATE
      },
      { sequelize }
    )
    return this
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'banner_id', as: 'banner' })
  }
}
export default Meetup
