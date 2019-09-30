import File from '../models/File'

class FileController {
  async store(req, res) {
    try {
      const { originalname: name, filename: path } = req.file

      const file = await File.create({ name, path, user_id: req.userId })

      return res.json(file)
    } catch (err) {
      return res.status(500).json({
        message: 'Error to save image',
        err
      })
    }
  }
}

export default new FileController()
