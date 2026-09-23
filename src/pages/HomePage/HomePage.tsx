import { useHomePage } from './useHomePage'

export const HomePage = () => {
  const { data, error, isLoading } = useHomePage()

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Home</h2>
      <div>
        {isLoading && <p className="text-gray-600">Loading...</p>}
        {data && <p className="text-green-600 font-medium">Backend: Connected</p>}
        {error && <p className="text-red-600 font-medium">Connection failed</p>}
      </div>
    </div>
  )
}
