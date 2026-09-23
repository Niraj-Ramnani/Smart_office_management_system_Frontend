import { Link } from 'react-router-dom'
import { useNotFoundPage } from './useNotFoundPage'

export const NotFoundPage = () => {
  const { statusCode } = useNotFoundPage()

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">{statusCode} - Not Found</h2>
      <Link to="/" className="text-blue-600 hover:underline inline-block text-sm">
        Go to Home
      </Link>
    </div>
  )
}
