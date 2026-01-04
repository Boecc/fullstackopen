import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, type: '' })


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')
      showNotification(`welcome ${username}`, 'success')
    } catch (exception) {
      console.error('Login error', exception)
      showNotification('wrong username or password', 'error')
    }
  }

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      showNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, 'success')
    } catch (exception) {
      console.error('Error creating blog', exception)
      showNotification('Error creating blog', 'error')
    }
  }

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: '' })
    }, 5000)
  }

  const handleLike = async (blog) => {
    const updateBlog = {
      ...blog,
      likes: blog.likes + 1
    }

    try {
      const returnedBlog = await blogService.update(blog.id, updateBlog)
      setBlogs(blogs.map(b => b.id !== blog.id ? b : returnedBlog))
      showNotification(`${returnedBlog.title} have a new like, likes ${returnedBlog.likes}`, 'success')
    } catch (exception) {
      console.error('Error updating likes', exception)
      showNotification('Error updating blog', 'error')
    }
  }

  return (
    <div>
      <h2>Blogs Application</h2>
      <Notification message={notification.message} type={notification.type} />
      {user === null ? (
        <div>
          <h2>Log in to application</h2>
          <LoginForm
            username={username}
            passowrd={password}
            handleUserNameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </div>
      ) : (
        <div>
          <h2>blogs</h2>
          <p>
            {user.name} logged in
            <button onClick={handleLogOut}>logout</button>
          </p>
          <Togglable buttonLabel='create new blog'>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} updateBlog={handleLike}/>
          )}
        </div>
      )}
    </div>
  )
}

export default App