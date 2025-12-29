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

after(async () => {
  await mongoose.connection.close()
})