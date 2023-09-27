const { Schema, model } = require('mongoose')


const blogSchema = Schema({
  title: {
    type: String,
    required: true, // This field is required
  },
  author: {
    type: String,
    required: true, // This field is required
  },
  url: String,
  likes: Number,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})


blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Blog = model('Blog', blogSchema)


module.exports = {
  Blog
}

