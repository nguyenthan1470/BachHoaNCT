import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './route/index'  
import store from './store/store.js'
import { Provider } from 'react-redux'

// chỗ này là lấy từ chỗ index.jsx trong thư mục route nghĩa là lấy các trang Home,... vv của trang web ra render ra 
createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Provider store={store} >
    
     <RouterProvider router={router} />  
  </Provider>
   
  // </StrictMode> 
)
