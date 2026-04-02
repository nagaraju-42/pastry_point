// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import App from './App.jsx'
// import './styles/index.css'

// // const queryClient = new QueryClient({
// //   defaultOptions: {
// //     queries: {
// //       retry: 1,
// //       staleTime: 1000 * 60 * 2, // 2 minutes
// //       refetchOnWindowFocus: false,
// //     },
// //   },
// // })
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       // ← This stops retrying on any 4xx error (400,401,403,404...)
//       retry: (failureCount, error) => {
//         const status = error?.response?.status
//         if (status >= 400 && status < 500) return false   // never retry 4xx
//         return failureCount < 1                            // retry once for 5xx
//       },
//       staleTime: 1000 * 60 * 2,
//       refetchOnWindowFocus: false,
//     },
//   },
// })

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <QueryClientProvider client={queryClient}>
//       <App />
//     </QueryClientProvider>
//   </React.StrictMode>,
// )
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'
import './styles/index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Never retry on any 4xx error — stops infinite 403 spam on cart/orders
      retry: (failureCount, error) => {
        const status = error?.response?.status
        if (status >= 400 && status < 500) return false  // 400,401,403,404 — never retry
        return failureCount < 1                          // 500 errors — retry once
      },
      staleTime: 1000 * 60 * 2,          // 2 minutes fresh
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)