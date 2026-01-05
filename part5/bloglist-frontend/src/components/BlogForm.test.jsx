import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import BlogForm from './BlogForm'
import { expect } from 'vitest'

// eslint-disable-next-line no-undef
test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  // eslint-disable-next-line no-undef
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const inputTitle = screen.getByPlaceholderText('write title here')
  const inputAuthor = screen.getByPlaceholderText('write author here')
  const inputUrl = screen.getByPlaceholderText('write url here')

  const createButton = screen.getByText('create')

  await user.type(inputTitle, 'testing a blog...')
  await user.type(inputAuthor, 'Test Author')
  await user.type(inputUrl, 'www.example.com')

  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)

  expect(createBlog.mock.calls[0][0].title).toBe('testing a blog...')
  expect(createBlog.mock.calls[0][0].author).toBe('Test Author')
  expect(createBlog.mock.calls[0][0].url).toBe('www.example.com')
})