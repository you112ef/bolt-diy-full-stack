import '../src/styles/globals.css'
import type { AppProps } from 'next/app'
import React, { useEffect } from 'react'
import { useAppStore } from '../src/store/useAppStore'

export default function App({ Component, pageProps }: AppProps) {
  const { settings } = useAppStore()

  useEffect(() => {
    // Apply theme to document
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [settings.theme])

  useEffect(() => {
    // Set document direction for Arabic support
    if (settings.language === 'ar') {
      document.documentElement.dir = 'rtl'
    } else {
      document.documentElement.dir = 'ltr'
    }
  }, [settings.language])

  return <Component {...pageProps} />
}