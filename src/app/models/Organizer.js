import { Model } from 'sequelize'

class Organizer extends Model {
  static init(sequelize) {
    super.init({}, { sequelize })
    return this
  }
}
export default Organizer
