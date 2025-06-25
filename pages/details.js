import React from 'react'

function Details() {
    return (
        <div className="bg-white min-h-full py-10 px-5">
            <div className='border-2 rounded-[15px] border-[var(--dark-blue)] p-5'>
                <p className='text-2xl font-boldtext-black'>05-sep-2023 , Tuesday</p>
                {/* {moment(new Date()).format("DD-MMM-YYYY , dddd")} */}
                <p className='text-4xl font-bold text-black'>Hello <span className='text-[var(--dark-orange)]'>Demomail.</span> </p>
            </div>

            <div className='border-2 border-[var(--dark-orange)] rounded-[15px] w-full mt-5 p-5 bg-[var(--dark-lightBlue)]'>
                <p className='text-[var(--dark-orange)] font-medium text-2xl'>Details</p>
                <div>
                    <p className='text-[var(--custom-blue)]   text-xl'>Exam Type</p>
                </div>
            </div>
        </div>
    )
}

export default Details