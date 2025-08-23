import React, { useEffect, useState } from 'react'
import { Api } from '@/services/service';
import { useRouter } from 'next/router';

function AboutUs(props) {
    const router = useRouter();
    const [aboutUsContent, setAboutUsContent] = useState('')

    useEffect(() => {
        getContent()
    }, [])

    const getContent = () => {
        props.loader(true);
        Api("get", "content/getContent", router).then(
            (res) => {
                console.log("res================>", res.data);
                props.loader(false);

                if (res?.status) {
                    setAboutUsContent(res?.data?.about_us)
                } else {
                    console.log(res?.data?.message);
                    props.toaster({ type: "error", message: res?.data?.message });
                }
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.data?.message });
                props.toaster({ type: "error", message: err?.message });
            }
        );
    };

    return (
        <section className='z-50 w-screen h-full'>
            <div className='bg-[var(--custom-blue)] w-full md:h-20 h-14'>
                <div className='max-w-6xl mx-auto h-full flex justify-start items-center md:px-0 px-5'>
                    <p className='md:text-3xl text-2xl font-semibold text-white text-start'>About Us</p>
                </div>
            </div>
            <div className='h-full max-w-6xl mx-auto py-5 md:py-5 md:px-0 px-5'>
                <p className='text-3xl font-semibold text-black text-start' dangerouslySetInnerHTML={{ __html: aboutUsContent }}></p>
            </div>
        </section>
    )
}

export default AboutUs
