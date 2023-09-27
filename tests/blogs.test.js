const { dummy, totalLikes, favoriteBlog, mostBlogs, authorWithMostLikes } = require('../utils/testhelpers/list_helper')
const { listOfBlogsForTest, listWithOneBlog } = require('../utils/testhelpers/dummyData')

test('dummy returns one', () => {
  const result = dummy(listWithOneBlog)
  expect(result).toBe(1)
})

describe('total likes', () => {

  test('when list has only one blog equals the likes of that', () => {
    const result = totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('Method return the blog has most likes', () => {

    const result = favoriteBlog(listOfBlogsForTest)
    expect(result).toEqual( {
      title: 'Blog 6',
      author: 'Author 1',
      url: 'https://example.com/blog/1',
      likes: 1110
    })
  })

  test('Method return Writer has most blogs', () => {
    authorWithMostLikes(listOfBlogsForTest)
    expect(mostBlogs(listOfBlogsForTest)).toEqual({ author: 'Author 1', blogs: 3 })

  })

  test('Method return Writer has most likes', () => {
    authorWithMostLikes(listOfBlogsForTest)
    expect(authorWithMostLikes(listOfBlogsForTest)).toEqual({ author: 'Author 1', likes: 1160 })

  })
})