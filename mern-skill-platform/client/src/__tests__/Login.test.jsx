import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Login from '../pages/Login'

const mockLogin = jest.fn()
const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))
jest.mock('react-hot-toast', () => ({ success: jest.fn(), error: jest.fn() }))

const renderLogin = () => render(
  <MemoryRouter>
    <AuthContext.Provider value={{ login: mockLogin, loading: false }}>
      <Login />
    </AuthContext.Provider>
  </MemoryRouter>
)

test('renders login form elements', () => {
  renderLogin()
  expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
})

test('calls login on valid submit', async () => {
  mockLogin.mockResolvedValue({ role: 'student', name: 'Test' })
  renderLogin()
  fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), { target: { value: 'test@test.com' } })
  fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'password123' } })
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
  await waitFor(() => expect(mockLogin).toHaveBeenCalledWith('test@test.com', 'password123'))
})
