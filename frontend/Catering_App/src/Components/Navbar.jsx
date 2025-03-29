import React from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'



function Navbar() {

  const location = useLocation()

const locationPath = location.pathname === "/login" || location.pathname==="/signup"

  return (
//    <div className='bg-grey-500 h-20 flex items-center justify-between'>
//     <div className='flex justify-between items-center'>
//         <img src='/Feastify_icon.png'className='h-11 m-4 rounded-lg hidden md:block ' alt="logo"/>
//         <img src='./public/Feastify.png' className='h-11 m-4 block md:hidden' alt="logo"/>
//         <h2 className='text-lg font-bold'>Feastify</h2>
//     </div>
//     <div className='list'>
//         <ul className='flex justify-around'>
//             <Link to={'/'} className='cursor-pointer text-[20px] pb-[5px] border-b-0 scale-100 transition-all duration-700 ease-in text-dark'><li>Home</li></Link>
//             <Link to={'/About'} className='cursor-pointer text-[20px]'><li>About</li></Link>
//             <Link to={'/Services'} className='cursor-pointer text-[20px]'><li>Services</li></Link>
//             <Link to={'/Carrers'} className='cursor-pointer text-[20px]'><li>Carrers</li></Link>
//         </ul>
//     </div>
//     <div>
//         <Link><button className="btn btn-ghost m-4">Login</button></Link>
//     </div>
//    </div>
<div className="navbar bg-base-100 shadow-sm fixed z-50">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
       <Link to={'/'} className={`cursor-pointer text-[20px] pb-[5px] scale-100 transition-all duration-700 ease-in text-dark border-b-2 border-transparent hover:border-b-orange-500 hover:text-orange-500 hover:-translate-y-0.5  ${location.pathname==="/"?'text-orange-500':''}`}><li>Home</li></Link>
           <Link to={'/About'} className={`cursor-pointer text-[20px] pb-[5px] scale-100 transition-all duration-700 ease-in text-dark border-b-2 border-transparent hover:border-b-orange-500 hover:text-orange-500 hover:-translate-y-0.5  ${location.pathname==="/About"?'text-orange-500':''}`}><li>About</li></Link>
           <Link to={'/Services'} className='cursor-pointer text-[20px] pb-[5px] scale-100 transition-all duration-700 ease-in text-dark border-b-2 border-transparent hover:border-b-orange-500 hover:text-orange-500 hover:-translate-y-0.5'><li>Services</li></Link>
             <Link to={'/Carrers'} className='cursor-pointer text-[20px] pb-[5px] scale-100 transition-all duration-700 ease-in text-dark border-b-2 border-transparent hover:border-b-orange-500 hover:text-orange-500 hover:-translate-y-0.5'><li>Carrers</li></Link>

      </ul>
    </div>
    <img src='/Feastify_icon.png'className='h-11 m-3 rounded-lg hidden lg:block ' alt="logo"/>
    {/* <img src='./public/Feastify.png' className='h-11 m-3 block lg:hidden' alt="logo"/> */}
    <a className="btn btn-ghost text-xl hidden lg:block">Feastify</a>
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className=" menu menu-horizontal px-1 space-x-13">
    <Link to={'/'} className='cursor-pointer text-[20px] pb-[5px] scale-100 transition-all duration-700 ease-in text-dark border-b-2 border-transparent hover:border-b-orange-500 hover:text-orange-500 hover:-translate-y-0.5' ><li>Home</li></Link>
           <Link to={'/About'} className='cursor-pointer text-[20px] pb-[5px] scale-100 transition-all duration-700 ease-in text-dark border-b-2 border-transparent hover:border-b-orange-500 hover:text-orange-500 hover:-translate-y-0.5'><li>About</li></Link>
           <Link to={'/Services'} className='cursor-pointer text-[20px] pb-[5px] scale-100 transition-all duration-700 ease-in text-dark border-b-2 border-transparent hover:border-b-orange-500 hover:text-orange-500 hover:-translate-y-0.5'><li>Services</li></Link>
             <Link to={'/Carrers'} className='cursor-pointer text-[20px] pb-[5px] scale-100 transition-all duration-700 ease-in text-dark border-b-2 border-transparent hover:border-b-orange-500 hover:text-orange-500 hover:-translate-y-0.5'><li>Carrers</li></Link>
    </ul>
  </div>
    <div className="navbar-end pr-4">
    <Link to={"/login"}><button className="btn" style={{visibility:locationPath? 'hidden':'visible'}}>Login</button></Link>
  </div>
  <img src='/Feastify.png' className='h-11 m-3 block lg:hidden' alt="logo"/>

</div>
)
}

export default Navbar