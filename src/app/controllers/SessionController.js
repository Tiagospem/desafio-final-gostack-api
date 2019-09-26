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

      if (!(await schema.isValid(req.body))) {
        throw 'Validation fails'
      }

      const { email, password } = req.body

      const user = await User.findOne({ where: { email } })

      if (!user) {
        throw 'The user is not found'
      }

      if (!(await user.checkPassword(password))) {
        throw 'The password doesnt match'
      }

      const { id, name } = user

      return res.json({
        user: { id, name, email },
        token: jwt.sign({ id }, authconfig.secret, {
          expiresIn: authconfig.expiresIn
        })
      })
    } catch (err) {
      return res.status(400).json({
        message: err
      })
    }
  }
}

export default new SessionController()
