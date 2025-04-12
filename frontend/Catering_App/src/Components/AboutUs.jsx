import React from 'react'
import { Link } from 'react-router-dom';
import Typewriter from 'typewriter-effect';

function AboutUs() {
  return (
<div className="flex p-8 justify-around bg-[url('/foodleft.jpg')] bg-cover bg-bottom">
<div className='flex flex-col p-14 max-w-170 hidden lg:block'>
            <div className='font-medium text-2xl'>
              <h1 className='text-right'>"Feastify is built for food lovers and event planners! We bridge the gap between professional 
                caterers and customers, making it easy to find the perfect menu for any occasion. 
                Whether it's a small birthday party or a grand wedding, we ensure that every meal is a masterpiece!"
              </h1>
            </div>
            <div className='pt-15 flex justify-end'>
            <Link to={"/About"}><button className="btn hover:btn-soft w-30 btn-warning">Learn more</button></Link>
            </div>
            </div>

        <div className='flex flex-col lg:min-w-110'>
            <div className='flex text-2xl pt-15'>
                <p className='font-normal'>
                Delicious Catering, Just a Click Away for Every
                <span className='mt-6'>
                <Typewriter
  options={{
    strings:["Celebration!", "Event!", "Gathering!", "Feast!", "Moment!"],
    autoStart:true,
    loop: true, 
    wrapperClassName:'text-yellow-500 font-bold text-3xl'
  }}  
/>
                </span>
                </p>
            </div>
            <div className='pt-20'>
            <img src='/pizzaguy.png' alt='Chef' className='max-h-100' />
            </div>
            <div className='pt-15 lg:hidden text-end'>
            <button className="btn btn-ghost w-30 btn-warning ">Learn more</button>
            </div>
        </div>
    </div>
  )
}

export default AboutUs