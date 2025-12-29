const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'Dijkstra',
    url: 'http://html-easy.com',
    likes: 5,
  },
  {
    title: 'Browser can execute only JavaScript',
    author: 'Brendan Eich',
    url: 'http://js-power.com',
    likes: 10,
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('the unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs/')
  const blogToInspect = response.body[0]
  assert.ok(blogToInspect.id)
})

test('new blog added', async () => {
  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'Javier Otero',
    url: 'https://fullstackopen.com/',
    likes: 15,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const initialBlogsLength = 2
  assert.strictEqual(response.body.length, initialBlogsLength + 1)

  const titles = response.body.map(r => r.title)
  assert(titles.includes('async/await simplifies making async calls'))
})

test('likes default to 0 if not given', async () => {
  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'Javier Otero',
    url: 'https://fullstackopen.com/',
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  assert.strictEqual(response.body.likes, 0)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'Javier Otero',
    url: 'https://fullstackopen.com/',
    likes: 1,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'Javier Otero',
    likes: 2,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('blog deleted', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await Blog.find({})
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

  const titles = blogsAtEnd.map(r => r.title)
  assert(!titles.includes(blogToDelete.title))
})

test('update blog', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToUpdate = blogsAtStart[0]
  const updatedData = {
    title: 'easy HTML',
    likes: blogToUpdate.likes + 1
  }

  const result = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedData)
    .expect(200)

  assert.strictEqual(result.body.likes, blogToUpdate.likes + 1)
  
  const blogsAtEnd = await Blog.find({})
  assert.strictEqual(result.body.title, blogsAtEnd[0].title)
})

after(async () => {
  await mongoose.connection.close()
})