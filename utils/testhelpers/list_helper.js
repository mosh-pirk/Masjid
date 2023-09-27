const { warn } = require('../logger')
const { countBy, maxBy, keys, groupBy, mapValues, sumBy } = require('lodash')
const { User } = require('../../models/user')
const dummy = (blogs) => {
  if (typeof blogs === 'object') {
    return blogs.length || 0
  } else {
    warn('Blogs is not object')
  }
}

const totalLikes = (blogs) => {
  if ( dummy(blogs) > 0 ) {
    return blogs.reduce( (y, x) => y + x.likes, 0)
  } else {
    return undefined
  }
}

const favoriteBlog = (blogs) => {
  if ( dummy(blogs) > 0 ) {
    return blogs.reduce( (mostLikes, x) => {
      return mostLikes.likes > x.likes ? mostLikes : x
    }, blogs[0])
  } else {
    return undefined
  }
}

const mostBlogs = (blogs) => {
  if ( dummy(blogs) > 0 ) {
    const authorBlogsCount = countBy(blogs, 'author')
    const author = maxBy(keys(authorBlogsCount), (x) => authorBlogsCount[x])
    return { author, blogs: authorBlogsCount[author] }
  } else {
    return undefined
  }
}

const authorWithMostLikes = (blogs) => {
  if ( dummy(blogs) > 0 ) {
    const likesByAuthor = groupBy(blogs, 'author')
    const countOfLikes = mapValues(likesByAuthor, (b) => sumBy(b, 'likes'))
    const author =  maxBy(keys(countOfLikes), (k) => countOfLikes[k] )
    return { author, likes: countOfLikes[author] }
  } else {
    return undefined
  }
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}
module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, authorWithMostLikes,
  usersInDb
}