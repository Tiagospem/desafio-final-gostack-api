import Meetup from '../models/Meetup'

class MeetupController {
  async index(req, res) {
    const meetups = await Meetup.findAll()
    return res.json(meetups)
  }

  async show(req, res) {
    try {
      const { meetup_id } = req.params
      const meetup = await Meetup.findByPk(meetup_id)
      if (!meetup) throw 'Meetup does not exists'
      return res.json(meetup)
    } catch (err) {
      return res.status(400).json({
        message: err
      })
    }
  }

  async store(req, res) {
    try {
      const data = req.body
      const meetup = await Meetup.create({
        ...data,
        user_id: req.userId
      })
      return res.json(meetup)
    } catch (err) {
      return res.status(400).json({
        message: 'Error to create meetup'
      })
    }
  }

  async update(req, res) {
    try {
      const { meetup_id } = req.params
      const user_id = req.userId
      const meetupExists = await Meetup.findByPk(meetup_id)

      if (!meetupExists)
        throw { code: 400, message: 'The meetup does not exists' }

      if (meetupExists.user_id !== user_id)
        throw { code: 401, message: 'Unauthorized' }

      const meetup = await meetupExists.update(req.body)

      return res.json(meetup)
    } catch (err) {
      return res.status(err.code).json({
        message: err.message
      })
    }
  }

  async delete(req, res) {
    try {
      const { meetup_id } = req.params
      const user_id = req.userId
      const meetupExists = await Meetup.findByPk(meetup_id)

      if (!meetupExists)
        throw { code: 400, message: 'The meetup does not exists' }

      if (meetupExists.user_id !== user_id)
        throw { code: 401, message: 'Unauthorized' }

      await meetupExists.destroy()

      return res.json({ message: 'Meetup deleted' })
    } catch (err) {
      return res.status(err.code).json({
        message: err.message
      })
    }
  }
}

export default new MeetupController()
