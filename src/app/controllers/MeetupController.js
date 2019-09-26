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
    return res.json()
  }

  async update(req, res) {
    return res.json()
  }

  async delete(req, res) {
    return res.json()
  }
}

export default new MeetupController()
