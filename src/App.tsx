import Main from './pages/Home'
import { ThemeProvider } from './context/ThemeProvider'

function App() {
  return (
    <ThemeProvider>
    <Main/>
    </ThemeProvider>
  )
}

export default App