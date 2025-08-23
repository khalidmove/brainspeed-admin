import React, { useMemo, useState, useEffect, useContext } from 'react'
import Table from "@/components/table";
import isAuth from '@/components/isAuth';
import { Api } from '@/services/service';
import { useRouter } from "next/router";
import { RxCross2 } from 'react-icons/rx'
import moment from 'moment';
import { userContext } from './_app';

function UserManagement(props) {
    const router = useRouter();
    const [productPopup, setProductPopup] = useState(false)
    const [userManagement, setUserManagement] = useState([]);
    const [popupData, setPopupData] = useState({});
    const [user, setUser] = useContext(userContext);

    const columns = useMemo(
        () => [
            {
                Header: "Student ID",
                accessor: "_id",
                Cell: studentID
            },
            {
                Header: "Student Name",
                accessor: 'fullName',
                Cell: studentName
            },
            // {
            //     Header: "Preparing for",
            //     accessor: 'preparingFor',
            //     Cell: preparingFor
            // },
            {
                Header: "Status",
                accessor: 'status',
                Cell: status
            },
            {
                Header: "View",
                accessor: 'view',
                Cell: view
            },
        ],
        []
    );

    useEffect(() => {
        getUsers()
    }, []);

    const handleClose = () => {
        setProductPopup(false);
    };

    const getUsers = () => {
        props.loader(true);
        Api("get", "getUsers", "", router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    console.log(res);
                    setUserManagement(res.data);
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

    function studentID({ value }) {
        return (
            < div>
                <p className='text-[var(--dark-orange)] text-base font-normal'>{value}</p>
            </div>
        )
    }

    function studentName({ value }) {
        return (
            < div>
                <p className='text-black text-base font-normal'>{value}</p>
            </div>
        )
    }

    function preparingFor({ value }) {
        return (
            < div>
                <p className='text-black text-base font-normal'>{value}</p>
            </div>
        )
    }

    function status({ value }) {
        return (
            < div>
                <p className='text-black text-base font-normal'>Active</p>
            </div>
        )
    }

    function view({ value, row }) {
        return (
            < div>
                <button className='text-white text-base font-normal bg-[var(--custom-blue)] h-[38px] w-[89px] rounded-[5px]'
                    onClick={() => {
                        setProductPopup(true)
                        const data = { ...row.original }
                        setPopupData(data)
                        console.log(row.original)
                    }}>View</button>
            </div>
        )
    }

    const imageOnError = (event) => {
        event.currentTarget.src = '/user-1.png';
        // event.currentTarget.className = "error";
    };

    return (
        <div className="bg-white min-h-full py-10 px-5">
            <div className='border-2 rounded-[15px] border-[var(--custom-blue)] p-5'>
                <p className='text-2xl font-bold text-black MerriweatherSans'>{`${moment(new Date()).format('DD-MMM-YYYY')} , ${moment(new Date()).format('dddd')}`}</p>
                <p className='md:text-4xl text-3xl font-bold text-black MerriweatherSans pt-2'>Hello <span className='text-[var(--dark-orange)]'>{user?.fullName}</span></p>
            </div>

            <div className='pt-5'>
                <Table columns={columns} data={userManagement} />
            </div>

            {productPopup && <div className='fixed top-0 left-0 w-screen h-screen bg-black/30 flex justify-center items-center z-50'>
                <div className=' relative w-[300px] md:w-[450px] h-auto bg-white border-2 border-[var(--custom-blue)] rounded-md m-auto'>
                    <div className=' absolute top-2 right-2 p-1 rounded-full bg-[var(--custom-blue)] text-white w-12 h-12 cursor-pointer'
                        onClick={handleClose}
                    >
                        <RxCross2 className='h-full w-full font-semibold' />
                    </div>

                    <div className='w-[300px] md:w-[450px]  flex items-center justify-center mt-8'>
                        {popupData?.profile && <img src={popupData?.profile} alt="" className=' w-[100px] h-[100px] rounded-full object-cover' onError={imageOnError} />}
                        {!popupData?.profile && <img src='/user-1.png' alt="" className=' w-[100px] h-[100px] rounded-full object-cover' onError={imageOnError} />}
                    </div>
                    <h2 className='text-2xl font-semibold text-center'>{popupData?.fullName}</h2>
                    <div className=' w-full  p-5 text-xl font-medium text-start'>
                        <p className='pb-1'><span className='font-bold'>Phone Number</span>{`: ${popupData?.phone}`}</p>
                        <p className='pb-1'><span className='font-bold'>Email</span>{`: ${popupData?.email}`}</p>
                        <p className='pb-1'><span className='font-bold'>Class</span>{`: ${popupData?.class}`}</p>
                        <p className='pb-1'><span className='font-bold'>Gender</span>{`: ${popupData?.gender}`}</p>
                        <p className='pb-1'><span className='font-bold'>Address</span>{`: ${popupData?.address}`}</p>
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default isAuth(UserManagement)