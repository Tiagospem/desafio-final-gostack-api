import { Router } from 'express'

import UserController from './app/controllers/UserController'

const route = new Router()

route.post('/users', UserController.store)

export default route
