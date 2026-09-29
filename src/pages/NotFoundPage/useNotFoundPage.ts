import { HTTP_STATUS } from '../../constants/httpStatus'

export const useNotFoundPage = () => {
  const statusCode = HTTP_STATUS.NOT_FOUND

  return {
    statusCode,
  }
}
