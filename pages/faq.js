import React, { useState, useEffect, useContext } from 'react'
import isAuth from '@/components/isAuth';
import { Api } from '@/services/service';
import { useRouter } from "next/router";
import FAQ from '@/components/Faq';
import { userContext } from './_app';
import moment from 'moment';

function Faq(props) {
    const router = useRouter();
    const [open, setOpen] = useState('');
    const [feqList, setFaqList] = useState([])
    const [user, setUser] = useContext(userContext);

    const handleClick = (item) => {
        console.log(item)
        setOpen(item);
    };

    useEffect(() => {
        faq()
    }, []);

    const faq = () => {
        props.loader(true);
        Api("get", "faq", "", router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    console.log(res);
                    setFaqList(res.data);
                } else {
                    props.toaster({ type: "success", message: res?.message });
                }
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    };

    return (
        <div className="bg-white min-h-full py-10 px-5">
            <div className='border-2 rounded-[15px] border-[var(--dark-blue)] p-5'>
                <p className='text-2xl font-bold text-black MerriweatherSans'>{`${moment(new Date()).format('DD-MMM-YYYY')} , ${moment(new Date()).format('dddd')}`}</p>
                <p className='md:text-4xl text-3xl font-bold text-black MerriweatherSans pt-2'>Hello <span className='text-[var(--dark-orange)]'>{user?.fullName}</span></p>
            </div>

            <FAQ props={props} />
        </div>
    )
}

export default isAuth(Faq)