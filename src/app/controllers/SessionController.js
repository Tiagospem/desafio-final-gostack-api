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
        return res.status(400).json({ message: 'Validation Fail' })

      const { email, password } = req.body

      const user = await User.findOne({ where: { email } })

      if (!user)
        return res.status(404).json({ message: 'The user is not found' })

      if (!(await user.checkPassword(password)))
        return res.status(400).json({ message: 'Password  does not match' })

      const { id, name } = user

      return res.json({
        user: { id, name, email },
        token: jwt.sign({ id }, authconfig.secret, {
          expiresIn: authconfig.expiresIn
        })
      })
    } catch (err) {
      return res.status(500).json({
        message: 'Error',
        err
      })
    }
  }
}

export default new SessionController()
