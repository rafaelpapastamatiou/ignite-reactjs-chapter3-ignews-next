import { render, screen } from '@testing-library/react'
import { getSession } from 'next-auth/client'
import { mocked } from 'ts-jest/utils'

import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { getPrismicClient } from '../../services/prismic'

jest.mock('../../services/prismic')
jest.mock('next-auth/client')

const post = {
  slug: 'fake-post',
  title: 'Fake post',
  content: '<p>Post excerpt<p>',
  updatedAt: 'April 10'
}

describe('Post page', () => {
  it('renders correctly', () => {
    render(
      <Post
        post={post}
      />
    )

    expect(screen.getByText('Fake post')).toBeInTheDocument()
    expect(screen.getByText('Post excerpt')).toBeInTheDocument()
  })

  it('redirects user when no subscription was found', async () => {
    const getSessionMocked = mocked(getSession)

    getSessionMocked.mockResolvedValueOnce(null)

    const response = await getServerSideProps({
      params: {
        slug: 'fake-post'
      }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/'
        })
      })
    )
  })

  it('loads initial data', async () => {
    const getSessionMocked = mocked(getSession)

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription'
    } as any)

    const getPrimisClientMocked = mocked(getPrismicClient)

    getPrimisClientMocked.mockReturnValue({
      getByUID: jest.fn().mockResolvedValue({
        data: {
          title: [{
            type: 'heading',
            text: 'Fake post'
          }],
          content: [{
            type: 'paragraph',
            text: 'Post content'
          }],
        },
        last_publication_date: '07-01-2021'
      })
    } as any)

    const response = await getServerSideProps({
      params: {
        slug: 'fake-post'
      }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'fake-post',
            title: 'Fake post',
            content: '<p>Post content</p>',
            updatedAt: '01 de julho de 2021'
          }
        }
      })
    )
  })
})