import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeProvider } from 'next-themes'
import { BrowserRouter, Route, Routes } from 'react-router'
import { DashboardPage, HomePage, NotFoundPage, AppSettingsPage } from './pages'
import { MainLayout, SettingsLayout } from './layouts'
import { LocalSettingsPage } from './pages/settings/LocalSettingsPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme='system' enableSystem>
      <BrowserRouter>
        <Routes>
          {/* 404 for all routes (client + api) */}
          <Route path='*' element={<NotFoundPage />} /> 
          
          {/* Main page */}
          <Route path='/' element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path='dashboard/:id' element={<DashboardPage />} />
          </Route>

          {/* App settings */}
          <Route path='/settings' element={<SettingsLayout />}>
            <Route index element={<AppSettingsPage />} />
            <Route path='local' element={<LocalSettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
