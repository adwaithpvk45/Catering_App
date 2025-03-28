import React from 'react'
import Typewriter from 'typewriter-effect';

function AboutUs() {
  return (
<div className="flex p-8 justify-around bg-[url('/aboutuschef.png')] bg-cover bg-center">
<div className='flex flex-col p-20 max-w-170'>
            <div className='font-medium text-2xl'>
              <h1>"Feastify is built for food lovers and event planners! We bridge the gap between professional 
                caterers and customers, making it easy to find the perfect menu for any occasion. 
                Whether it's a small birthday party or a grand wedding, we ensure that every meal is a masterpiece!"
              </h1>
            </div>
            <div className='pt-15'>
            <button className="btn btn-ghost w-30 ">Learn more</button>
            </div>
            </div>

        <div className='flex flex-col min-w-110'>
            <div className='flex text-2xl'>
                <p className='font-normal'>
                Delicious Catering, Just a Click Away for Every
                <span className='mt-6'>
                <Typewriter
  options={{
    strings:["Celebration!", "Event!", "Gathering!", "Feast!", "Moment!"],
    autoStart:true,
    loop: true, 
    wrapperClassName:'text-yellow-500 font-bold text-2xl'
  }}  
/>
                </span>
                </p>
            </div>
            <div className='pt-20'>
                <img src='/3 people.png' alt='Chef' className=' rounded-full'/>
            </div>
        </div>
    </div>
  )
}

export default AboutUs