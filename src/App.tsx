import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import EditMemo from './pages/EditMemo';
import CreateMemo from './pages/CreateMemo';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ヘッダーなし */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* ヘッダーあり */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/new" element={<CreateMemo />} />
            <Route path="/edit/:id" element={<EditMemo />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
