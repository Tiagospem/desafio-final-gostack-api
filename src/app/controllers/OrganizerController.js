import Meetup from '../models/Meetup'
import File from '../models/File'
import User from '../models/User'
import Subscription from '../models/Subscription'

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

  async show(req, res) {
    try {
      const { meetup_id } = req.params
      const meetup = await Meetup.findOne({
        where: {
          id: meetup_id,
          user_id: req.userId
        },
        include: [
          {
            model: File,
            as: 'banner',
            attributes: ['id', 'url', 'path']
          },
          {
            model: User,
            as: 'organizer',
            attributes: ['name', 'email']
          },
          {
            model: Subscription,
            as: 'subscriptions'
          }
        ]
      })
      if (!meetup)
        return res.status(400).json({ message: 'The meetup does not exists' })
      return res.json(meetup)
    } catch (err) {
      return res.status(500).json({
        message: 'Error',
        err
      })
    }
  }
}
export default new OrganizerController()
