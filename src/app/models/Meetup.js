import { isBefore } from 'date-fns'
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
        date: Sequelize.DATE,
        past_meetup: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date())
          }
        }
      },
      { sequelize }
    )
    return this
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'banner_id', as: 'banner' })
    this.hasMany(models.Subscription, {
      foreignKey: 'meetup_id',
      as: 'subscriptions'
    })
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'organizer' })
  }
}
export default Meetup
