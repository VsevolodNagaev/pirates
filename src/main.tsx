import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { HomePage } from '@/pages/HomePage'
import { MapPage } from '@/pages/MapPage'
import { NewsArticlePage } from '@/pages/NewsArticlePage'
import { NewsPage } from '@/pages/NewsPage'
import './index.css'

const RulesPage = lazy(() => import('@/pages/RulesPage').then((m) => ({ default: m.RulesPage })))
const RefsPage = lazy(() => import('@/pages/RefsPage').then((m) => ({ default: m.RefsPage })))

function Fallback() {
  return <p className="py-16 text-center text-parchment/50">Загрузка…</p>
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined}>
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="news/:id" element={<NewsArticlePage />} />
            <Route path="map" element={<MapPage />} />
            <Route path="rules" element={<RulesPage />} />
            <Route path="refs" element={<RefsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
