import { render, screen, fireEvent } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'

import { SubscribeButton } from '../../components/SubscribeButton'

jest.mock('next-auth/client')
jest.mock('next/router')

describe('SignInButton Component', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false])

    render(
      <SubscribeButton />
    )

    expect(screen.getByText('Subscribe now')).toBeInTheDocument()
  })

  it('redirects user to sign in when not authenticated', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false])

    const signInMocked = mocked(signIn)

    render(
      <SubscribeButton />
    )

    const subscribeButton = screen.getByText('Subscribe now')

    fireEvent.click(subscribeButton)

    expect(signInMocked).toHaveBeenCalled()
  })

  it('redirects user to posts when he already has a subscription', () => {
    const useRouterMocked = mocked(useRouter)
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([{
      user: {
        name: 'John Doe',
      },
      expires: 'fake-expires',
      activeSubscription: {
        id: 'fake-id',
        price_id: 'fake-price-id',
        status: 'fake-active-subscription'
      },
    }, true])

    const pushMock = jest.fn()

    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any)

    render(
      <SubscribeButton />
    )

    const subscribeButton = screen.getByText('Subscribe now')

    fireEvent.click(subscribeButton)

    expect(pushMock).toHaveBeenCalledWith('/posts')
  })
})