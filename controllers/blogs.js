const { Blog } = require('../models/blogs')
const blogsRouter = require('express').Router()


blogsRouter.get('', async (request, response) => {
  const user = request['headers'].user
  if (user) {
    const blogs = await Blog.find({}).populate('user')
    response.status(200).json(blogs)
  } else {
    response.status(401).json({ error: 'User is Unauthorized' })
  }

})

blogsRouter.post('', async (request, response) => {
  let blogData = request.body
  const user = request['headers'].user

  if (blogData.likes === undefined) {
    blogData.likes = 0
  }

  const blog = new Blog({ ...request.body, user: user._id })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(blog._id)
  await user.save()
  response.status(201).json(savedBlog)
})
blogsRouter.delete('/:id', async (request, response) => {
  const user = request['headers'].user
  const blog = await Blog.findById(request.params.id)

  if ( blog.user.toString() === user.id.toString() ) {
    const id = request.params.id
    await Blog.findByIdAndDelete(id)
    response.status(204).end()
  } else {
    response.status(401).json({ error: 'User is Unauthorized' })
  }

})
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user')
  response.status(200).json(blog)
})
blogsRouter.put('/:id', async (request, response) => {

  const user = request['headers'].user
  const blog = await Blog.findById(request.params.id)

  if ( blog.user.toString() === user.id.toString() ) {
    const modifiedBlog = request.body

    for (const key in blog) {
      if (modifiedBlog[key] && key !== 'user') {
        blog[key] = request.body[key]
      }
    }

    const updated = await Blog.findByIdAndUpdate({ _id: blog.id }, modifiedBlog, { returnOriginal: false }).populate('user')

    response.status(200).json(updated)
  } else {
    response.status(401).json({ error: 'User is Unauthorized' })
  }


})

module.exports = {
  blogsRouter
}