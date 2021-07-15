import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { Async } from '../../components/Async'


describe('Async Component', () => {
  it('renders correctly', async () => {
    render(
      <Async />
    )

    expect(screen.getByText('Hello World')).toBeInTheDocument()

    await waitFor(() => {
      return expect(screen.getByText('Visible after 2 seconds')).toBeInTheDocument()
    }, {
      timeout: 3000
    })

    // Waiting for element to be removed
    await waitForElementToBeRemoved(screen.queryByText('Invisible after 3 seconds'))

    await waitFor(() => {
      return expect(screen.queryByText('Invisible after 3 seconds')).not.toBeInTheDocument()
    }, {
      timeout: 4000
    })

  })
})