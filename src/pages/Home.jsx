import React from 'react'
import CustomCarousel from '../components/Carousel'
import LatestProducts from '../components/LatestProducts'
import BestSellingProducts from '../components/BestSellingProducts'
import ServiceFeatures from '../components/ServiceFeatures'
import Footer from '../components/Footer'


function Home() {
  return (
    <div>
        <CustomCarousel/>
        <LatestProducts/>
        <ServiceFeatures/>
        <BestSellingProducts/>
       
        <Footer/>
    </div>
  )
}

export default Home