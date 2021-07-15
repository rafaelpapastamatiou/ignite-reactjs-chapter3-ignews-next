import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'

import Posts, { getStaticProps } from '../../pages/posts'
import { getPrismicClient } from '../../services/prismic'

jest.mock('../../services/prismic')

const posts = [
  {
    slug: 'fake-post',
    title: 'Fake post',
    excerpt: 'Post excerpt',
    updatedAt: 'April 10'
  }
]
describe('Posts page', () => {
  it('renders correctly', () => {
    render(
      <Posts
        posts={posts}
      />
    )

    expect(screen.getByText('Fake post')).toBeInTheDocument()
  })

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'fake-post',
            data: {
              title: [{
                type: 'heading',
                text: 'Fake post'
              }],
              content: [{
                type: 'paragraph',
                text: 'Post excerpt'
              }],
            },
            last_publication_date: '07-01-2021'
          }
        ]
      })
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [{
            slug: 'fake-post',
            title: 'Fake post',
            excerpt: 'Post excerpt',
            updatedAt: '01 de julho de 2021'
          }]
        }
      })
    )
  })
})