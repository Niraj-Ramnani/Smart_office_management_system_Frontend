import { Link } from 'react-router-dom'

export const LoginPage = () => {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Login</h2>
      <p className="text-gray-500">Login page placeholder</p>
      <Link to="/" className="text-blue-600 hover:underline inline-block text-sm">
        Return to Home
      </Link>
    </div>
  )
}
