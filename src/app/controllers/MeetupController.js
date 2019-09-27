import * as Yup from 'yup'
import { parseISO, isBefore } from 'date-fns'
import Meetup from '../models/Meetup'
import File from '../models/File'

class MeetupController {
  async index(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query
      const user_id = req.userId
      const meetups = await Meetup.findAll({
        where: { user_id },
        order: ['date'],
        limit: Number(limit),
        offset: (page - 1) * Number(limit),
        include: [
          {
            model: File,
            as: 'banner',
            attributes: ['id', 'url', 'path']
          }
        ]
      })
      return res.json(meetups)
    } catch (err) {
      return res.status(400).json({
        message: 'Erro to load meetups',
        error: err
      })
    }
  }

  async show(req, res) {
    try {
      const { meetup_id } = req.params
      const meetup = await Meetup.findByPk(meetup_id)
      if (!meetup) throw { code: 404, message: 'The meetup does not exists' }
      return res.json(meetup)
    } catch (err) {
      return res.status(err.code).json({
        message: err.message
      })
    }
  }

  async store(req, res) {
    try {
      const data = req.body
      const schema = Yup.object().shape({
        title: Yup.string().required(),
        description: Yup.string().required(),
        location: Yup.string().required(),
        date: Yup.date().required()
      })

      if (!(await schema.isValid(data)))
        throw { code: 400, message: 'Validation fail' }

      const dateNow = new Date()

      if (isBefore(parseISO(data.date), dateNow))
        throw { code: 400, message: 'Invalid date' }

      const meetup = await Meetup.create({
        ...data,
        user_id: req.userId
      })
      return res.json(meetup)
    } catch (err) {
      return res.status(err.code).json({
        message: err.message
      })
    }
  }

  async update(req, res) {
    try {
      const data = req.body

      const schema = Yup.object().shape({
        title: Yup.string().required(),
        description: Yup.string().required(),
        location: Yup.string().required(),
        date: Yup.date().required()
      })

      if (!(await schema.isValid(data)))
        throw { code: 400, message: 'Validation fail' }

      const dateNow = new Date()
      const { meetup_id } = req.params
      const user_id = req.userId
      const meetupExists = await Meetup.findByPk(meetup_id)

      if (!meetupExists)
        throw { code: 404, message: 'The meetup does not exists' }

      if (meetupExists.user_id !== user_id)
        throw { code: 401, message: 'Unauthorized' }

      if (isBefore(meetupExists.date, dateNow))
        throw { code: 401, message: 'You cant update past meetups' }

      if (isBefore(parseISO(data.date), dateNow))
        throw { code: 400, message: 'Invalid date' }

      const meetup = await meetupExists.update(data)

      return res.json(meetup)
    } catch (err) {
      return res.status(err.code).json({
        message: err.message
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
        throw { code: 404, message: 'The meetup does not exists' }

      if (meetupExists.user_id !== user_id)
        throw { code: 401, message: 'Unauthorized' }

      if (isBefore(meetupExists.date, dateNow))
        throw { code: 401, message: 'You cant cancel past meetups' }

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
