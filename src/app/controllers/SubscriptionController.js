import * as Yup from 'yup'
import Subscription from '../models/Subscription'
import Meetup from '../models/Meetup'
import User from '../models/User'
import File from '../models/File'
import SubscriptionMail from '../jobs/SubscriptionMail'
import Queue from '../../lib/Queue'

class SubscriptionController {
  async index(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query
      const user_id = req.userId

      const subscriptions = await Subscription.findAll({
        where: { user_id },
        order: ['created_at'],
        limit: Number(limit),
        offset: (page - 1) * Number(limit),
        attributes: ['id'],
        include: [
          {
            model: Meetup,
            as: 'meetup',
            include: [
              {
                model: User,
                as: 'organizer',
                attributes: ['id', 'name', 'email']
              },
              {
                model: File,
                as: 'banner',
                attributes: ['id', 'url', 'path']
              }
            ]
          }
        ]
      })
      return res.json(subscriptions)
    } catch (err) {
      return res.status(500).json({
        message: 'Error',
        err
      })
    }
  }

  async show(req, res) {
    try {
      const { subscription_id } = req.params
      const user_id = req.userId
      const subscription = await Subscription.findByPk(subscription_id, {
        include: [
          {
            model: Meetup,
            as: 'meetup',
            include: [
              {
                model: User,
                as: 'organizer',
                attributes: ['id', 'name', 'email']
              },
              {
                model: File,
                as: 'banner'
              }
            ]
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          }
        ]
      })

      if ((subscription && subscription.user_id !== user_id) || !subscription)
        return res
          .status(404)
          .json({ message: 'The subscription does not exists' })

      return res.json(subscription)
    } catch (err) {
      return res.status(500).json({
        message: 'Error',
        err
      })
    }
  }

  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        meetup_id: Yup.number().required()
      })

      if (!(await schema.isValid(req.body)))
        return res.status(400).json({ message: 'Validation fail' })

      const meetup_id = req.body.meetup_id
      const user_id = req.userId

      const meetup = await Meetup.findByPk(meetup_id, {
        include: [
          {
            model: User,
            as: 'organizer',
            attributes: ['email', 'name']
          }
        ]
      })

      if (!meetup)
        return res.status(404).json({ message: 'The meetup doest not exists' })

      if (meetup.past_meetup)
        return res.status(401).json({ message: 'The meetup ended' })

      if (user_id === meetup.user_id)
        return res
          .status(401)
          .json({ message: 'You cant subscribe in your own meetup' })

      const subscriptionExists = await Subscription.findOne({
        where: { user_id, meetup_id }
      })

      if (subscriptionExists)
        return res
          .status(401)
          .json({ message: 'You already subscribed this meetup' })

      const checkSubIncompatibility = await Subscription.findOne({
        where: { user_id },
        include: [
          {
            model: Meetup,
            as: 'meetup',
            where: {
              date: meetup.date
            }
          }
        ]
      })

      if (checkSubIncompatibility)
        return res.status(401).json({
          message: `You already have a meetup in this date.
          (${checkSubIncompatibility.meetup.title}), please cancel it and
           try agan.`
        })

      const subscription = await Subscription.create({ meetup_id, user_id })

      const { name } = await User.findByPk(user_id)

      await Queue.add(SubscriptionMail.key, {
        meetup,
        name,
        subscription
      })

      return res.json(subscription)
    } catch (err) {
      return res.status(500).json({ message: 'Error', err })
    }
  }

  async delete(req, res) {
    try {
      const { subscription_id } = req.params
      const user_id = req.userId
      const subscription = await Subscription.findByPk(subscription_id, {
        include: [
          {
            model: Meetup,
            as: 'meetup'
          }
        ]
      })

      if (!subscription)
        return res
          .status(404)
          .json({ message: 'The subscription does not exists' })

      if (subscription.user_id !== user_id)
        return res.status(401).json({ message: 'Unauthorized' })

      if (subscription.meetup.past_meetup)
        return res
          .status(401)
          .json({ message: 'You cant unsubscribe ended meetups' })

      await subscription.destroy()

      return res.json({ message: 'Unsubscribed' })
    } catch (err) {
      return res.status(500).json({
        message: 'Erro',
        err
      })
    }
  }
}
export default new SubscriptionController()
