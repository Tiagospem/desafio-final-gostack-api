import { Router } from 'express'
import multer from 'multer'

import multerconfig from './config/multer'

import auth from './app/middlewares/auth'

import SessionController from './app/controllers/SessionController'
import UserController from './app/controllers/UserController'
import FileController from './app/controllers/FileController'
import MeetupController from './app/controllers/MeetupController'

const route = new Router()
const upload = multer(multerconfig)

route.post('/sessions', SessionController.store)
route.post('/users', UserController.store)

route.use(auth)
route.put('/users', UserController.update)

route.post('/files', upload.single('file'), FileController.store)

route.post('/meetups', MeetupController.store)
route.get('/meetups/:meetup_id', MeetupController.show)
route.put('/meetups/:meetup_id', MeetupController.update)
route.delete('/meetups/:meetup_id', MeetupController.delete)

export default route
