import { Router } from 'express'
import multer from 'multer'

import multerconfig from './config/multer'

import auth from './app/middlewares/auth'

import SessionController from './app/controllers/SessionController'
import UserController from './app/controllers/UserController'
import FileController from './app/controllers/FileController'

const route = new Router()
const upload = multer(multerconfig)

route.post('/sessions', SessionController.store)
route.post('/users', UserController.store)

route.use(auth)
route.put('/users', UserController.update)

route.post('/files', upload.single('file'), FileController.store)

export default route
