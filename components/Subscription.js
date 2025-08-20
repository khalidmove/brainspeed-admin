import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { MdOutlineAdd } from 'react-icons/md'
import { Api } from '@/services/service'
import { AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai'
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { BsChevronDown } from 'react-icons/bs'
import Swal from "sweetalert2";

function Subscription({ props, setActiveSubscriptionPlan }) {
    const [open, setOpen] = useState(0)
    const [createFAQ, setCreatFAQ] = useState(false)
    const [faq, setFaq] = useState([])
    const [newFAQ, setNewFAQ] = useState({
        "offer": "",
        "plan": "",
        "type": "",
        "period": ""
    })
    const [singleFaq, setSigleFaq] = useState({})
    const router = useRouter();

    const getFAQ = () => {
        props.loader(true);
        Api("get", "subscription/getSubscription", '', router).then(
            (res) => {
                console.log("res================>", res.data.incident);
                props.loader(false);

                if (res?.status) {
                    setFaq(res.data)
                    setActiveSubscriptionPlan(res.data[0].is_on)
                    //  setTerms({ termsAndConditions: res?.data[0]?.termsAndConditions, id: res?.data[0]?._id })
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

    const deleteFAQ = (item) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete this plan?",
            icon: "warning",
            showCancelButton: true,
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
        }).then(function (result) {
            if (result.isConfirmed) {
                props.loader(true);
                Api("delete", `subscription/deleteSubscription/${item?._id}`, '', router).then(
                    (res) => {
                        console.log("res================>", res.data.incident);
                        props.loader(false);

                        if (res?.status) {
                            props.toaster({ type: "success", message: res?.data?.message });
                            getFAQ()
                            //  setTerms({ termsAndConditions: res?.data[0]?.termsAndConditions, id: res?.data[0]?._id })
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
            }
        })
    };

    const submit = () => {
        // if (!newFAQ.question || !newFAQ.answer) {
        //     props.toaster({ type: "error", message: "Missing credentials" });
        //     return
        // }
        let mathod = singleFaq?._id ? 'put' : "post"
        props.loader(true)
        let url = singleFaq?._id ? `subscription/updateSubscription/${singleFaq?._id}` : 'subscription/createSubscription'

        Api(mathod, url, newFAQ, router).then(
            (res) => {
                console.log("res================>", res.data.incident);
                props.loader(false);

                if (res?.status) {
                    // setFaq([...faq, res.data.faq])
                    getFAQ()
                    props.toaster({ type: "success", message: res?.data?.message });
                    setNewFAQ({
                        question: '',
                        answer: ""
                    })
                    setCreatFAQ(false);
                    setSigleFaq({})
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

    }

    useEffect(() => {
        getFAQ();
    }, [])

    return (
        <div className='w-full mt-5'>
            {
                createFAQ &&
                <div className={` z-50 fixed right-10 bottom-20 shadow-2xl w-[300px]  md:w-[350px] max-h-[550px] bg-white rounded-xl overflow-hidden`}>
                    <div className='p-4 bg-[var(--custom-blue)] text-white text-2xl'>
                        <p>{`${singleFaq?._id ? 'Update' : 'Create'} Subscription`}</p>
                    </div>
                    <div className='p-3 w-full space-y-2'>
                        <p>Plan Type</p>
                        <div className='w-full border-2 border-[var(--custom-blue)] rounded-sm'>
                            <input type="text" value={newFAQ.type} className='w-full rounded-sm border-none outline-none p-2' placeholder='Plan Type'
                                onChange={(e) => setNewFAQ({ ...newFAQ, type: e.target.value })} />
                        </div>
                        <p>Offer</p>
                        <div className='w-full border-2 border-[var(--custom-blue)] rounded-sm'>
                            <input type="number" value={newFAQ.offer} className='w-full rounded-sm border-none outline-none p-2' placeholder='Offer'
                                onChange={(e) => setNewFAQ({ ...newFAQ, offer: e.target.value })} />
                        </div>
                        <p>Plan</p>
                        <div className='w-full border-2 border-[var(--custom-blue)] rounded-sm'>
                            <input type="number" value={newFAQ.plan} className='w-full rounded-sm border-none outline-none p-2' placeholder='Plan'
                                onChange={(e) => setNewFAQ({ ...newFAQ, plan: e.target.value })} />
                        </div>

                        <p>Period (How many Month?)</p>
                        <div className='w-full border-2 border-[var(--custom-blue)] rounded-sm'>
                            <input type="number" value={newFAQ.period} className='w-full rounded-sm border-none outline-none p-2' placeholder='Period'
                                onChange={(e) => setNewFAQ({ ...newFAQ, period: e.target.value })} />
                        </div>
                        <button className=' py-2 px-6 text-white bg-[var(--custom-blue)] rounded-md mx-auto w-full ' onClick={submit}> {`${singleFaq?._id ? 'UPDATE' : 'CREATE'}`}</button>
                    </div>
                </div>
            }

            <div
                className=' cursor-pointer fixed bottom-3 right-10 w-16 h-16 bg-[var(--custom-blue)] text-[var(--custom-blue)] text-2xl p-3 rounded-full'
                onClick={() => setCreatFAQ(!createFAQ)}>
                {
                    createFAQ ?
                        <BsChevronDown className='w-full h-full font-bold text-white' />
                        :
                        <MdOutlineAdd className='w-full h-full text-white' />
                }
            </div>
            <div className='w-full border-2 rounded-md border-[var(--custom-blue)] p-4 space-y-2 md:space-y-4'>
                {
                    faq &&
                    faq?.map((item, idx) => (
                        <div key={idx} className=' border-t-8 border-[var(--custom-blue)] rounded-md border-[2px] '>
                            <div className='w-full p-2 md:p-3 border-b-[2px] border-[var(--custom-blue)] flex md:items-center justify-between gap-2 cursor-pointer'
                                onClick={() => {
                                    if (open === idx + 1) {
                                        setOpen(0);
                                    }
                                    else {
                                        setOpen(idx + 1)
                                    }
                                }}>

                                <p className='capitalize'>{item?.type}</p>
                                <div className='flex gap-5'>
                                    <div className='w-5 cursor-pointer'>
                                        {
                                            open === idx + 1 ?
                                                <AiOutlineArrowUp className='text-[var(--custom-blue)] font-bold text-2xl' />
                                                :
                                                <AiOutlineArrowDown className='text-[var(--custom-blue)] font-bold text-2xl' />
                                        }
                                    </div>
                                    <div className='w-5 cursor-pointer'>
                                        <FaEdit className='text-[var(--custom-blue)] font-bold text-2xl' onClick={() => {
                                            setNewFAQ({
                                                offer: item.offer,
                                                plan: item?.plan,
                                                type: item.type,
                                                period: item?.period
                                            });
                                            setSigleFaq(item);
                                            setCreatFAQ(true)

                                        }} />

                                    </div>
                                    <div className='w-15 cursor-pointer'>
                                        <RiDeleteBin2Fill className='text-[var(--custom-blue)] font-bold text-2xl' onClick={() => { deleteFAQ(item) }} />

                                    </div>
                                </div>

                            </div>
                            <div className={`w-full p-2 md:p-3 ${open === idx + 1 ? 'h-auto block' : ' hidden h-0'} transition-all duration-500`}>
                                <p>Plan: {item?.plan}</p>
                                <p>Offer: {item?.offer}</p>
                                <p>Period: {item?.period} Month(s)</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Subscription