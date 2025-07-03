import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import toast, { Toaster } from 'react-hot-toast'
import fetchUserDetails from './utils/fetchUserDetails.js'
import { useEffect } from 'react'
import { setUserDetails } from './store/userSlice.js'
import { setAllCategory, setAllSubCategory, setLoadingCategory } from "./store/productSlice.js"
import { useDispatch } from 'react-redux'
import SummaryApi from './common/SummaryApi.jsx'
import Axios from './utils/Axios.js'
import { handleAddItemCart } from './store/cartProduct.js'
import GlobalProvider from './provider/GlobalProvider.jsx'
import CartMobileLink from './components/CartMobile.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const dispatch = useDispatch()
  const location = useLocation()
  const clientId = import.meta.env.VITE_GG_CLIENT_ID

  const fetchUser = async () => {
    const userData = await fetchUserDetails()
    dispatch(setUserDetails(userData.data))
  }

  const fetchCategory = async () => {
    try {

      dispatch(setLoadingCategory(true))
      const response = await Axios({
        ...SummaryApi.getCategory
      })

      const { data: responseData } = response

      if (responseData.success) {
        dispatch(setAllCategory(responseData.data))
      }

    } catch (error) {

    } finally {
      dispatch(setLoadingCategory(false))

    }
  }
  const fetchSubCategory = async () => {
    try {


      const response = await Axios({
        ...SummaryApi.getSubCategory
      })

      const { data: responseData } = response

      if (responseData.success) {
        dispatch(setAllSubCategory(responseData.data))
      }

    } catch (error) {

    } finally {


    }
  }

  useEffect(() => {
    fetchUser()
    fetchCategory()
    fetchSubCategory()
    // fetchCartItem()
  }, [])


  return (
    // ở đây là nơi chứa bố cục trang web
    <GoogleOAuthProvider clientId={clientId}>
      <GlobalProvider>
        <Header />
        <main className='min-h-[78vh]' >
          <Outlet />
        </main>

        <Footer />

        <Toaster />
        {
          location.pathname !== '/checkout' && (
            <CartMobileLink />
          )
        }
      </GlobalProvider>
     </GoogleOAuthProvider>
  )
}

export default App
