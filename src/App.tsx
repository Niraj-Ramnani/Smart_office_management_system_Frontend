import { AppRoutes } from './routes/AppRoutes'
import { ToastContainer } from './components/common/ToastContainer'

export const App = () => {
  return (
    <>
      <AppRoutes />
      <ToastContainer />
    </>
  )
}

export default App
