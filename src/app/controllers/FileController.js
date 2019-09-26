import File from '../models/File'

class FileController {
  async store(req, res) {
    try {
      const { originalname: name, filename: path } = req.file

      const file = await File.create({ name, path, user_id: req.userId })

      return res.json(file)
    } catch (err) {
      console.log(err)
      return res.status(400).json({
        error: { message: 'Error to save image' }
      })
    }
  }
}

export default new FileController()
