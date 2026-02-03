import { Routes, Route, Link } from 'react-router-dom'
import { Truck, Info, Settings } from 'lucide-react'
import { ReservationPage } from './pages/ReservationPage'
import { AdminPage } from './pages/AdminPage'

export default function App() {
    return (
        <div className="min-h-screen bg-[#f0f2f5] font-sans text-[#2e2f32]">
            {/* Nav Estilo Walmart */}
            <nav className="bg-[#0071dc] py-4 px-6 shadow-md border-b-4 border-[#ffc220]">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-4 text-white hover:opacity-90 transition-opacity">
                        <Truck className="text-white h-8 w-8" />
                        <h1 className="text-2xl font-bold tracking-tight">Despacho a Domicilio</h1>
                    </Link>

                    <Link to="/admin" className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors" title="Administración">
                        <Settings className="h-6 w-6" />
                    </Link>
                </div>
            </nav>

            <Routes>
                <Route path="/" element={<ReservationPage />} />
                <Route path="/admin" element={<AdminPage />} />
            </Routes>

            <footer className="max-w-6xl mx-auto px-6 py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest border-t">
                <div className="flex items-center gap-2 justify-center">
                    <Info className="h-4 w-4 text-[#0071dc]" />
                    Sistema de gestión logística.
                </div>
            </footer>
        </div>
    )
}