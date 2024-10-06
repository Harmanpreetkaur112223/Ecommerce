import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


import {createBrowserRouter , RouterProvider} from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './components/Home/Home'
import About from './components/About/About'
import Services from './components/Services/Services'
import Feedback from './components/Feedback/Feedback'
import Regiter from './components/Regiter'
const router = createBrowserRouter([
  {
    path:'/',
    element:<Layout/>,
    children:[
      {
        path:'',
        element:<Home/>
      },
      {
        path:'about',
        element:<About />
      },
      {
        path:'services',
        element:<Services/>
      },
      {
        path:'feedback',
        element:<Feedback/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <RouterProvider router={router} /> */}
    <Regiter />
  
  </StrictMode>,
)
