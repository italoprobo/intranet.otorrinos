import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage/LoginPage'
import HomePage from './pages/HomePage/HomePage'
import ListarMultiprofissionaisPage from './pages/ListarMultiPage/ListarMulti'
import DetalhesMulti from './pages/DetalhesMultiPage/DetalhesMulti'
import 'bootstrap/dist/css/bootstrap.min.css';
import RegisterPage from './pages/RegisterPage/RegisterPage'
import AdminRoute from './pages/components/AdminRoute'
import AdicionarMultiprofissionais from './pages/AdicionarMultiPage/AdicionarMultiprofissionais'
import ListarConvenioPage from './pages/ListarConvenios/ListarConvenioPage'
import DetalhesConvenio from './pages/DetalhesConvenios/DetalhesConvenioPage'
import AddConveniosPage from './pages/AdicionarConvPage/AdicionarConvenioPage'
import EditData from './pages/components/alterarDados/alterarDados'
import ResetPassword from './pages/components/alterarSenha/alterarSenha'
import ProfilePage from './pages/ProfilePage/ProfilePage'

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
        <Route path='/' element={<HomePage></HomePage>}></Route>
          <Route path='/login' element={<LoginPage></LoginPage>}></Route>
          <Route path='/listar-multiprofissionais' element={<ListarMultiprofissionaisPage></ListarMultiprofissionaisPage>}></Route>
          <Route path='/medicos/:id' element={<DetalhesMulti></DetalhesMulti>}></Route>
          <Route path='/registrar' element={<RegisterPage></RegisterPage>}></Route>
          <Route path='/add-multiprofissionais' element={<AdminRoute><AdicionarMultiprofissionais /></AdminRoute>}></Route>
          <Route path='/listar-convenios' element={<ListarConvenioPage></ListarConvenioPage>}></Route>
          <Route path='/convenios/:id' element={<DetalhesConvenio></DetalhesConvenio>}></Route>
          <Route path='/add-convenios' element={<AdminRoute><AddConveniosPage></AddConveniosPage></AdminRoute>}></Route>
          <Route path='/alterar-dados' element={<EditData></EditData>}></Route>
          <Route path='/reset-password' element={<ResetPassword></ResetPassword>}></Route>
          <Route path='/profile' element={<ProfilePage></ProfilePage>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App