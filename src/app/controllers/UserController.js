import * as Yup from 'yup'
import User from '../models/User'

class UserController {
  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string()
          .email()
          .required(),
        password: Yup.string()
          .required()
          .min(8)
      })

      if (!(await schema.isValid(req.body)))
        throw { code: 400, message: 'Validation fail' }

      const userExists = await User.findOne({
        where: { email: req.body.email }
      })

      if (userExists) throw { code: 400, message: 'User already exists' }

      const { id, name, email } = await User.create(req.body)

      return res.json({ id, name, email })
    } catch (err) {
      return res.status(err.code || 400).json({
        message: err.message
      })
    }
  }

  async update(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string(),
        email: Yup.string().email(),
        oldPassword: Yup.string().min(8),
        password: Yup.string()
          .min(8)
          .when('oldPassword', (oldPassword, field) =>
            oldPassword ? field.required() : field
          ),
        passwordConfirm: Yup.string().when('password', (password, field) =>
          password ? field.required().oneOf([Yup.ref('password')]) : field
        )
      })

      if (!(await schema.isValid(req.body)))
        throw { code: 400, message: 'Validation fail' }

      const { email, oldPassword } = req.body
      const user = await User.findByPk(req.userId)

      if (email !== user.email) {
        const userExists = await User.findOne({ where: { email } })
        if (userExists) throw { code: 400, message: 'The email already exists' }
      }

      if (oldPassword && !(await user.checkPassword(oldPassword)))
        throw { code: 400, message: 'Password  does not match' }

      const { id, name } = await user.update(req.body)

      return res.json({ id, name, email })
    } catch (err) {
      return res.status(err.code || 400).json({
        message: err.message
      })
    }
  }
}
export default new UserController()
