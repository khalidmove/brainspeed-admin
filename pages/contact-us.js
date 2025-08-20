import React, { useEffect, useState } from 'react'
import { Api } from '@/services/service';
import { useRouter } from 'next/router';

function ContactUs(props) {
    const router = useRouter();
    const [contactUsContent, setContactUsContent] = useState('')

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
                    setContactUsContent(res?.data?.contact_us)
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
            <div className='h-full max-w-6xl mx-auto py-5 md:py-5 md:px-0 px-5'>
                <p className='text-3xl font-semibold text-black text-start' dangerouslySetInnerHTML={{ __html: contactUsContent }}></p>
            </div>
        </section>
    )
}

export default ContactUs
