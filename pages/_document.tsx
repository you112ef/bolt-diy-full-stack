import React from 'react'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="Yousef SS - AI-powered development platform with intelligent agents" />
        <meta name="keywords" content="AI, development, coding, editor, terminal, agent" />
        <meta name="author" content="Yousef SS" />
        
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Yousef SS" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Yousef SS" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#7c3aed" />
        
        {/* Icons */}
        <link rel="icon" href="/app-icon.svg" />
        <link rel="apple-touch-icon" href="/app-icon.svg" />
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        
        {/* Monaco Editor Worker */}
        <script>
          {`
            if (typeof window !== 'undefined') {
              window.MonacoEnvironment = {
                getWorkerUrl: function(moduleId, label) {
                  if (label === 'json') {
                    return '/monaco-editor/esm/vs/language/json/json.worker.js';
                  }
                  if (label === 'css' || label === 'scss' || label === 'less') {
                    return '/monaco-editor/esm/vs/language/css/css.worker.js';
                  }
                  if (label === 'html' || label === 'handlebars' || label === 'razor') {
                    return '/monaco-editor/esm/vs/language/html/html.worker.js';
                  }
                  if (label === 'typescript' || label === 'javascript') {
                    return '/monaco-editor/esm/vs/language/typescript/ts.worker.js';
                  }
                  return '/monaco-editor/esm/vs/editor/editor.worker.js';
                }
              };
            }
          `}
        </script>
      </Head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}