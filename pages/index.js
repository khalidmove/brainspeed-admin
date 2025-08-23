import React, { useMemo, useState, useEffect } from 'react'
import Table from "@/components/table";
import isAuth from '@/components/isAuth';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Api } from '@/services/service';
import { useRouter } from "next/router";
import moment from 'moment'
import { useContext } from 'react';
import { userContext } from './_app';

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard(props) {
    const router = useRouter();
    const [user, setUser] = useContext(userContext);
    const [userData, setUserData] = useState({});
    const [opt, setOpt] = useState({});


    useEffect(() => {
        dashboard()
    }, []);

    const dashboard = () => {
        props.loader(true);
        Api("get", "dashboard", "", router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    console.log(res);
                    setUserData(res?.data)
                    setOpt({
                        labels: ['Subscriber', 'Unsubscriber'],
                        datasets: [
                            {
                                label: "Users",
                                data: [res.data.users.subscriber, res.data.users.unsubscriber],
                                backgroundColor: [
                                    '#020973',
                                    '#2A61F0',
                                ],
                                borderColor: [
                                    'black',
                                    'black',
                                ],
                                borderWidth: 1,
                            },
                        ],
                    })
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
            <div className='border-2 rounded-[15px] border-[var(--custom-blue)] p-5'>
                <p className='text-2xl font-bold text-black MerriweatherSans'>{`${moment(new Date()).format('DD-MMM-YYYY')} , ${moment(new Date()).format('dddd')}`}</p>
                <p className='md:text-4xl text-3xl font-bold text-black MerriweatherSans pt-2'>Hello <span className='text-[var(--custom-blue)]'>{user?.name}</span></p>
            </div>
            <div className='grid md:grid-cols-2 grid-cols-1 w-full gap-10 md:pt-10 pt-5'>
                <div>
                    <div className='grid md:grid-cols-2 grid-cols-1 w-full gap-5'>

                        <div className='h-24 w-full rounded-lg bg-[var(--custom-blue)] p-5 flex  justify-between items-center drop-shadow-xl'>
                            <div className='flex justify-start items-center'>
                                <img className='h-[44px] w-[44px]' src='/user.png' />
                            </div>
                            <div className='flex flex-col justify-center items-center'>
                                <p className='text-xl font-normal text-white'>Total Users</p>
                                <p className='text-base font-normal text-white'>{userData?.users?.allusers} users</p>
                            </div>
                        </div>

                        <div className='h-24 w-full rounded-lg bg-[var(--custom-blue)] p-5 flex justify-between items-center drop-shadow-xl'>
                            {/* border-2 border-[var(--custom-blue)] */}
                            <div className='flex justify-start items-center'>
                                <img className='h-[44px] w-[44px]' src='/subscribed_img.png' />
                            </div>
                            <div className='flex flex-col justify-center items-center'>
                                <p className='text-xl font-normal text-white'>Subscribed</p>
                                <p className='text-base font-normal text-white'>{userData?.users?.subscriber} users</p>
                            </div>
                        </div>

                        <div className='h-24 w-full rounded-lg bg-[var(--custom-blue)] p-5 flex justify-between items-center drop-shadow-xl'>
                            <div className='flex justify-start items-center'>
                                <img className='h-[44px] w-[44px]' src='/subscribed_img.png' />
                            </div>
                            <div className='flex flex-col justify-center items-center'>
                                <p className='text-xl font-normal text-white'>Unsubscribed</p>
                                <p className='text-base font-normal text-white'>{userData?.users?.unsubscriber} users</p>
                            </div>
                        </div>

                        <div className='h-24 w-full rounded-lg bg-[var(--custom-blue)] p-5 flex justify-between items-center drop-shadow-xl'>
                            <div className='flex justify-start items-center'>
                                <img className='h-[44px] w-[44px]' src='/Result_img.png' />
                            </div>
                            <div className='flex flex-col justify-end items-end'>
                                <p className='text-xl font-normal text-white'>Total Quiz</p>
                                <p className='text-base font-normal text-white'>{userData?.quiz?.allquizs}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-5 pt-5">
                        <div className="border border-[var(--custom-blue)] h-[61px] w-full rounded-md p-2 flex justify-between items-center">
                            <div className='flex justify-start items-center'>
                                <img className='h-[34px] w-[34px]' src='/createIcon-1.png' />
                            </div>
                            <div className='flex flex-col justify-center items-center'>
                                <p className='text-xs font-normal text-[var(--custom-blue)]'>Today upload</p>
                                <p className='text-[10px] font-normal text-[var(--custom-blue)]'>{userData?.quiz?.today} Quiz</p>
                            </div>
                        </div>
                        <div className="border border-[var(--custom-blue)] h-[61px] w-full rounded-md p-2 flex justify-between items-center">
                            <div className='flex justify-start items-center'>
                                <img className='h-[34px] w-[34px]' src='/createIcon-1.png' />
                            </div>
                            <div className='flex flex-col justify-center items-center'>
                                <p className='text-xs font-normal text-[var(--custom-blue)]'>Last week</p>
                                <p className='text-[10px] font-normal text-[var(--custom-blue)]'>{userData?.quiz?.week} Quiz</p>
                            </div>
                        </div>
                        <div className="border border-[var(--custom-blue)] h-[61px] w-full rounded-md p-2 flex justify-between items-center">
                            <div className='flex justify-start items-center'>
                                <img className='h-[34px] w-[34px]' src='/createIcon-1.png' />
                            </div>
                            <div className='flex flex-col justify-center items-center'>
                                <p className='text-xs font-normal text-[var(--custom-blue)]'>Last month</p>
                                <p className='text-[10px] font-normal text-[var(--custom-blue)]'>{userData?.quiz?.month} Quiz</p>
                            </div>
                        </div>
                    </div>

                    {/* <div className="pt-5">
                        <Table columns={columns} data={user} />
                    </div> */}
                </div>

                <div className='flex justify-center items-center'>
                    {/* <img src="/images.png" /> */}
                    {opt?.labels?.length > 0 && <Doughnut data={opt} className="max-h-80 " />}
                </div>
            </div>
        </div>
    )
}

export default isAuth(Dashboard)