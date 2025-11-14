import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'  
import SearchPage from './pages/SearchPage'
import DetailPage from './pages/DetailPage'
import SearchOnlyPage from './pages/SearchOnlyPage'
import MyListsPage from './pages/MyListsPage'

export default function App() {
  return (
    <div className="flex flex-col min-h-screen text-white bg-black"> 
      <Navbar />
      <main className="flex-1">                                          
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/anime/:id" element={<DetailPage />} />
          <Route path="/search" element={<SearchOnlyPage />} />
          <Route path="/mylists" element={<MyListsPage />} />
        </Routes>
      </main>
      <Footer />                                                          
    </div>
  )
}
