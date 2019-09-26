import { Router } from 'express'

import auth from './app/middlewares/auth'

import SessionController from './app/controllers/SessionController'
import UserController from './app/controllers/UserController'

const route = new Router()

route.post('/sessions', SessionController.store)
route.post('/users', UserController.store)

route.use(auth)
route.put('/users', UserController.update)

export default route
