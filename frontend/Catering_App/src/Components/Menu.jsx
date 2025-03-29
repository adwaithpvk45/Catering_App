import React from 'react'
import cateringServices from '../store/data'
import { Link } from 'react-router-dom'

function Menu() {
  return (
   <div className='flex flex-col p-10 bg-amber-100'>
    <div className='flex '>
        <h1 className='text-5xl'>Cuisines<span className='text-amber-300 text-9xl'>.</span></h1>
    </div>
    <div className='flex flex-wrap gap-30 pb-10 pt-20 p-15 md:p-20 transition-all duration-300'>
    {
        cateringServices.map((item)=>
            
           ( 
           <div key={item.id} className="card bg-base-100 w-70 shadow-lg transition-all duration-300">
  <figure>
    <img
      src={item.image}
      alt={item.title} />
  </figure>
  <div className="card-body hover:bg-black hover:text-white transition-all duration-700">
    <h2 className="card-title">{item.title}</h2>
    <p>{item.description}</p>
    <div className="card-actions justify-end">
    <Link><button className="btn btn-warning btn-xs sm:btn-sm md:btn-md hover:bg-white hover:text-black">Explore</button></Link>
     </div>
  </div>
</div>
           )
        )
    }
    </div>
    <div className='flex justify-center lg:justify-end p-3  '>
    <Link><button className="btn btn-warning btn-xs sm:btn-sm md:btn-md ">View All</button></Link>
    </div>

   </div>
)
}

export default Menu