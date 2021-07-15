import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { mocked } from 'ts-jest/utils'

import Preview, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { getPrismicClient } from '../../services/prismic'

jest.mock('next-auth/client')
jest.mock('next/router')
jest.mock('../../services/prismic')

const post = {
  slug: 'fake-post',
  title: 'Fake post',
  content: '<p>Post excerpt<p>',
  updatedAt: 'April 10'
}

describe('Post preview page', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValue([null, false])

    render(
      <Preview
        post={post}
      />
    )

    expect(screen.getByText('Post excerpt')).toBeInTheDocument()
    expect(screen.getByText('Fake post')).toBeInTheDocument()
    expect(screen.getByText('Wanna continue reading ?')).toBeInTheDocument()
  })

  it('redirects user to full post when user has a valid subscription', () => {
    const useSessionMocked = mocked(useSession)
    const useRouterMocked = mocked(useRouter)
    const pushMock = jest.fn()

    useSessionMocked.mockReturnValue([{
      activeSubscription: 'fake-active-subscription'
    } as any, false])


    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any)

    render(<Preview post={post} />)

    expect(pushMock).toHaveBeenCalledWith('/posts/fake-post')
  })

  it('loads initial data', async () => {
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

    const response = await getStaticProps({
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