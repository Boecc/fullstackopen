import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import Blog from './Blog'
import { expect } from 'vitest'

// eslint-disable-next-line no-undef
test('renders title and author but not url or likes by default', () => {
  const blog = {
    title: 'Testing React components',
    author: 'react-test',
    url: 'www.example.com',
    likes: 5,
    user: {
      username: 'root',
      name: 'Superuser'
    }
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('Testing React components', { exact: false })
  const elementAuthor = screen.getByText('react-test', { exact: false })
  expect(element).toBeDefined()
  expect(elementAuthor).toBeDefined()

  const url = screen.queryByText('www.example.com')
  const likes = screen.queryByText('likes 5')
  expect(url).toBeNull()
  expect(likes).toBeNull()
})

// eslint-disable-next-line no-undef
test('clicking the button shows url and likes', async () => {
  const blog = {
    title: 'Testing React components',
    author: 'react-test',
    url: 'www.example.com',
    likes: 5,
    user: {
      username: 'root',
      name: 'Superuser'
    }
  }

  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const url = screen.queryByText('www.example.com')
  const likes = screen.queryByText('likes 5')

  expect(url).toBeDefined()
  expect(likes).toBeDefined()
})

// eslint-disable-next-line no-undef
test('clicking like button twice calls event handler twice', async () => {
  const blog = {
    title: 'Testing React components',
    author: 'react-test',
    url: 'www.example.com',
    likes: 5,
    user: {
      username: 'root',
      name: 'Superuser'
    }
  }
  // eslint-disable-next-line no-undef
  const mockHandler = vi.fn()

  render(<Blog blog={blog} updateBlog={mockHandler}/>)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})