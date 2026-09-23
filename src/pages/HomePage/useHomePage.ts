import { useGetHealthQuery } from '../../store/api/baseApi'

export const useHomePage = () => {
  const { data, error, isLoading } = useGetHealthQuery()

  return {
    data,
    error,
    isLoading,
  }
}
