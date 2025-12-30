const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

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
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('secret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()

  const blog1 = new Blog({ ...initialBlogs[0], user: user.id })
  await blog1.save()

  const blog2 = new Blog({ ...initialBlogs[1], user: user.id })
  await blog2.save()
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
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'secret' })

  const token = loginResponse.body.token

  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'Javier Otero',
    url: 'https://fullstackopen.com/',
    likes: 15,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length + 1)

  const titles = response.body.map(r => r.title)
  assert(titles.includes('async/await simplifies making async calls'))
})

test('likes default to 0 if not given', async () => {
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'secret' })
  const token = loginResponse.body.token

  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'Javier Otero',
    url: 'https://fullstackopen.com/',
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  assert.strictEqual(response.body.likes, 0)
})

test('blog without title is not added', async () => {
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'secret' })
  const token = loginResponse.body.token

  const newBlog = {
    author: 'Javier Otero',
    url: 'https://fullstackopen.com/',
    likes: 1,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('blog without url is not added', async () => {
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'secret' })
  const token = loginResponse.body.token

  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'Javier Otero',
    likes: 2,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('blog deleted', async () => {
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'secret' })
  const token = loginResponse.body.token

  const newBlog = {
    title: 'Blog to delete',
    author: 'Delete Me',
    url: 'http://delete.com'
  }

  const createdBlog = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  const blogToDelete = createdBlog.body

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await Blog.find({})
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