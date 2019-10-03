import Meetup from '../models/Meetup'
import File from '../models/File'
import User from '../models/User'

class OrganizerController {
  async index(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query

      const meetups = await Meetup.findAll({
        where: { user_id: req.userId },
        order: [['date', 'DESC']],
        limit: Number(limit),
        offset: (page - 1) * Number(limit),
        include: [
          {
            model: File,
            as: 'banner',
            attributes: ['id', 'url', 'path']
          },
          {
            model: User,
            as: 'organizer',
            attributes: ['id', 'name', 'email']
          }
        ]
      })
      return res.json(meetups)
    } catch (err) {
      return res.status(500).json({
        message: 'Error',
        err
      })
    }
  }
}
export default new OrganizerController()
