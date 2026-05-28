import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Pdv from './pages/Pdv'
import Produtos from './pages/Produtos'
import ProdutoForm from './pages/ProdutoForm'
import Clientes from './pages/Clientes'
import ClienteForm from './pages/ClienteForm'
import Funcionarios from './pages/Funcionarios'
import FuncionarioForm from './pages/FuncionarioForm'
import Relatorios from './pages/Relatorios'
import Cameras from './pages/Cameras'

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) {
    return (
      <div className="pf" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Carregando…
      </div>
    )
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="pdv" element={<Pdv />} />
        <Route path="produtos" element={<Produtos />} />
        <Route path="produtos/novo" element={<ProdutoForm />} />
        <Route path="produtos/:id" element={<ProdutoForm />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="clientes/novo" element={<ClienteForm />} />
        <Route path="clientes/:id" element={<ClienteForm />} />
                <Route path="funcionarios" element={<Funcionarios />} />
                <Route path="funcionarios/novo" element={<FuncionarioForm />} />
                <Route path="funcionarios/:id" element={<FuncionarioForm />} />
        <Route path="relatorios" element={<Relatorios />} />
        <Route path="cameras" element={<Cameras />} />
      </Route>
    </Routes>
  )
}
