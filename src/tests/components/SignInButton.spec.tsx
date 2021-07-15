import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/client'
import { mocked } from 'ts-jest/utils'

import { SignInButton } from '../../components/SignInButton'

jest.mock('next-auth/client')

describe('SignInButton Component', () => {
  const useSessionMocked = mocked(useSession)


  it('renders correctly when user is not authenticated', () => {
    useSessionMocked.mockReturnValueOnce([null, false])

    render(
      <SignInButton />
    )

    expect(screen.getByText('Sign in with GitHub')).toBeInTheDocument()
  })


  it('renders correctly when user is authenticated', () => {
    useSessionMocked.mockReturnValue([{
      user: {
        name: 'John Doe',
      },
      expires: 'fake-expires',
      activeSubscription: null
    }, true])


    render(
      <SignInButton />
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })
})