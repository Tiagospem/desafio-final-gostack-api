import * as Yup from 'yup'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import authconfig from '../../config/auth'

class SessionController {
  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email()
          .required(),
        password: Yup.string().required()
      })

      if (!(await schema.isValid(req.body)))
        throw { code: 400, message: 'Validation Fail' }

      const { email, password } = req.body

      const user = await User.findOne({ where: { email } })

      if (!user) throw { code: 404, message: 'The user is not found' }

      if (!(await user.checkPassword(password)))
        throw { code: 400, message: 'Password  does not match' }

      const { id, name } = user

      return res.json({
        user: { id, name, email },
        token: jwt.sign({ id }, authconfig.secret, {
          expiresIn: authconfig.expiresIn
        })
      })
    } catch (err) {
      return res.status(err.code || 400).json({
        message: err.message
      })
    }
  }
}

export default new SessionController()
