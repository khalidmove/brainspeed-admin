import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router';
import moment from 'moment';
import { AiOutlineCheck } from 'react-icons/ai';
import { userContext } from './_app';
import { Api } from '@/services/service';
import Table from '@/components/table';

const Notifications = (props) => {
    const router = useRouter()
    const [notification, setNotification] = useState('')
    const [SortedBookings, setSortedBookings] = useState([])
    const [selected, setSelected] = useState([])
    const [allSelected, setAllSelected] = useState(false)
    const [user, setUser] = useContext(userContext);

    useEffect(() => {
        getUser();
    }, [])

    useEffect(() => {
        if (!JSON.parse(localStorage.getItem("userDetail"))) {
            router.push('/login')
        }
    })

    useEffect(() => {
        let updated = SortedBookings.map((book) => {
            if (allSelected) {
                book.checked = true
                return book
            }
            else {
                book.checked = false
                return book
            }
        })
        setSortedBookings(updated)
    }, [allSelected])

    const getUser = () => {
        props.loader(true);
        Api("get", 'auth/getUser', router).then(
            (res) => {
                console.log("res================>", res);
                props.loader(false);
                setSortedBookings(res.data)
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    }

    const sendNotification = () => {
        let users = Array.from(new Set(
            SortedBookings.filter((book) => {
                if (book.checked) {
                    return book
                }
            })
                .map((book) => book._id)
        ))
        if (!notification) {
            props.toaster({ type: "error", message: "Notification Required" })
            return
        }
        if (users.length === 0) {
            props.toaster({ type: "error", message: "Select Bookings" })
            return
        }
        props.loader(true);
        Api("post", 'notification/create', { notification, users: users }, router).then(
            (res) => {
                props.loader(false);
                console.log("res================>", res);
                setNotification('')
                getUser()
                props.toaster({ type: 'success', message: res.message });
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    }

    const nameHandler = ({ value }) => {
        return (
            <div className='py-4 flex items-center justify-start'>
                <p className='font-semibold text-lg'>{value}</p>
            </div>
        )
    }

    const statusHandler = ({ value }) => {
        return (
            <div className='py-4 flex items-center justify-start'>
                <p className={`font-semibold text-lg `}>{value}</p>
            </div>
        )
    }

    const startDateHandler = ({ value }) => {
        return (
            <div className=' py-4 flex items-center  justify-start'>
                <p className='font-semibold text-lg'>{moment(value).format('DD MMM YYYY  hh:mma')}</p>
            </div>
        )
    }

    const checkBoxHandler = ({ value, row }) => {
        return (
            <div className=' p-4 flex items-center  justify-start'>
                <div className={`w-5 h-5 ${selected.includes(value) && 'bg-black'} ${(row.original.checked) && 'bg-black'} text-white border border-black flex items-center justify-center cursor-pointer`}
                    onClick={() => {
                        let updated = SortedBookings.map((book) => {
                            if (book._id === value) {
                                book.checked = !book.checked
                                return book
                            }
                            return book
                        })
                        setSortedBookings(updated)
                    }}
                >
                    <AiOutlineCheck className={`font-semibold  ${(row.original.checked) ? 'text-white' : ''}`} />
                </div>
            </div>
        )
    }

    const columns = useMemo(() => [
        {
            Header: "SELECT",
            accessor: "_id",
            Cell: checkBoxHandler
        },
        {
            Header: "NAME",
            accessor: "name",
            Cell: nameHandler
        },
        {
            Header: "NUMBER",
            accessor: "phone",
            Cell: nameHandler
        },
        {
            Header: "EMAIL",
            accessor: "email",
            Cell: statusHandler
        },
        {
            Header: "CREATED DATE",
            accessor: 'createdAt',
            Cell: startDateHandler

        }
    ], [SortedBookings, allSelected])

    return (
        <>
            <div className="bg-white min-h-full md:pt-10 pt-11 md:pb-10 pb-5 px-5">
                <div className='border-2 rounded-[15px] border-[var(--custom-blue)] p-5'>
                    <div className='md:flex justify-between'>
                        <div>
                            <p className='text-2xl font-bold text-black MerriweatherSans'>{`${moment(new Date()).format('DD-MMM-YYYY')} , ${moment(new Date()).format('dddd')}`}</p>
                            <p className='md:text-4xl text-3xl font-bold text-black MerriweatherSans pt-2'>Hello <span className='text-[var(--custom-blue)]'>{user?.name}</span></p>
                        </div>
                    </div>
                </div>

                <div className='w-[99%] mx-auto md:w-full bg-white h-full border-2 border-[var(--custom-blue)] rounded-[15px] p-3 md:p-6 flex flex-col overflow-auto space-y-4 mt-5'>
                    <h2 className='upercase text-2xl md:text-3xl font-semiboldtext-center md:text-left'>Notification:</h2>
                    <div className='p-3 md:p-4 bg-[#00000010] text-sm  md:text-lg rounded-3xl font-semibold'>
                        <textarea type="text" className='w-full bg-transparent outline-none' rows={5} value={notification}
                            placeholder='Write Something'
                            onChange={(e) => setNotification(e.target.value)} />
                    </div>
                    <div className='flex items-center  gap-10 justify-center md:justify-start'>
                        <button className='md:px-10 md:py-3 px-3 py-1 text-white font-semibold text-md md:text-2xl bg-[var(--custom-blue)] rounded-lg'
                            onClick={sendNotification}
                        >Send Notification</button>
                        <button className=' px-3 py-1 text-white  text-md bg-[var(--custom-blue)] rounded-lg' onClick={() => setAllSelected(!allSelected)}>{allSelected ? "Unselect all" : "Select All"}</button>
                    </div>
                    <div className='h-full w-full'>
                        <Table columns={columns} data={SortedBookings} />
                    </div>
                </div>
            </div>
        </>

    )
}

export default Notifications