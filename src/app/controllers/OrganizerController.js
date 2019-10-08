import Meetup from '../models/Meetup'
import File from '../models/File'
import User from '../models/User'
import { isBefore } from 'date-fns'
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
          },
          {
            model: Subscription,
            as: 'subscriptions',
            attributes: ['id']
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
            as: 'subscriptions',
            attributes: ['id'],
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['name', 'email']
              }
            ]
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

  async delete(req, res) {
    try {
      const dateNow = new Date()
      const { meetup_id } = req.params
      const user_id = req.userId
      const meetupExists = await Meetup.findByPk(meetup_id)

      if (!meetupExists)
        return res.status(404).json({ message: 'The meetup does not exists' })

      if (meetupExists.user_id !== user_id)
        return res.status(404).json({ message: 'Unauthorized' })

      if (isBefore(meetupExists.date, dateNow))
        return res.status(401).json({ message: 'You cant cancel past meetups' })

      await meetupExists.destroy()

      return res.json({ message: 'Meetup deleted' })
    } catch (err) {
      return res.status(500).json({
        message: 'Error',
        err
      })
    }
  }
}
export default new OrganizerController()
