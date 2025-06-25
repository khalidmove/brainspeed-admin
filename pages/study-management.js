import React, { useMemo, useState, useEffect, useContext } from 'react'
import Table, { indexID } from "@/components/table";
import { Api } from '@/services/service';
import { useRouter } from "next/router";
import moment from 'moment';
import isAuth from '@/components/isAuth';
import { MdOutlineDelete } from 'react-icons/md'
import { FaRegEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { userContext } from './_app';


function StudyManagement(props) {
    const router = useRouter();
    const [quizzData, setQuizzData] = useState([]);
    const [user, setUser] = useContext(userContext);

    useEffect(() => {
        getQuizz()
    }, []);

    const getQuizz = () => {
        props.loader(true);
        Api("get", "get_study", "", router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    console.log(res);
                    setQuizzData(res.data);
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

    const Alert = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to proceed with the deletion?",
            icon: "warning",
            showCancelButton: true,
            cancelButtonColor: "#d33",
            confirmButtonText: "Delete"
        })
            .then(function (result) {
                if (result.isConfirmed) {

                    props.loader(true);
                    Api("delete", `deletestudy/${id}`, '', router).then(
                        (res) => {
                            console.log("res================>", res);
                            props.loader(false);

                            if (res?.status) {

                                getQuizz()
                                props.toaster({ type: "error", message: res?.data?.message });
                            } else {
                                console.log(res?.data?.message);
                                props.toaster({ type: "error", message: res?.data?.message });
                            }
                        },
                        (err) => {
                            props.loader(false);
                            console.log(err);
                            props.toaster({ type: "error", message: err?.data.message });
                        }
                    );
                } else if (result.isDenied) {
                    // setFullUserDetail({})
                }

            });
    };

    const columns = useMemo(
        () => [
            {
                Header: "No",
                Cell: indexID,
            },
            {
                Header: "Date",
                accessor: 'createdAt',
                Cell: dataFormet
            },
            {
                Header: "Subject",
                accessor: 'subject.name',
                Cell: name
            },
            {
                Header: "Topic",
                accessor: 'topic.wholetopictitle',
                Cell: name
            },
            // {
            //     Header: "Time",
            //     accessor: 'time',
            //     // Cell: time
            // },
            {
                Header: "ACTION",
                Cell: Action,
            },
        ],
        []
    );

    function name({ value, row }) {
        console.log(row?.original)
        return (
            < div>
                <p className='text-black text-base font-normal flex-wrap whitespace-normal w-56'>{value}</p>
            </div>
        )
    }

    function dataFormet({ row }) {
        return (
            < div>
                <p className='text-black text-base font-normal'>{moment(row?.original?.createdAt).format('DD-MM-YYYY')}</p>
            </div>
        )
    }

    function Action({ row }) {
        console.log(row?.original)
        return (
            < div className='flex gap-3'>
                <button
                    onClick={() => { router.push(`/create-study?id=${row?.original?._id}`) }}
                    className='h-10 w-10 bg-[var(--custom-blue)] flex justify-center items-center rounded font-nunito'><FaRegEdit className='h-5 w-5 text-white' /></button>
                <button
                    onClick={() => { Alert(row?.original?._id); }}
                    className='h-10 w-10 bg-[var(--custom-blue)] flex justify-center items-center rounded font-nunito'><MdOutlineDelete className='h-5 w-5 text-white' /></button>
            </div >
        )
    }

    return (
        <div className="bg-white min-h-full py-10 px-5">
            <div className='border-2 rounded-[15px] border-[var(--dark-blue)] p-5'>
                <div className='md:flex justify-between'>
                    <div>
                        <p className='text-2xl font-bold text-black MerriweatherSans'>{`${moment(new Date()).format('DD-MMM-YYYY')} , ${moment(new Date()).format('dddd')}`}</p>
                        <p className='md:text-4xl text-3xl font-bold text-black MerriweatherSans pt-2'>Hello <span className='text-[var(--dark-orange)]'>{user?.fullName}</span></p>
                    </div>
                    <div>
                        <button className='bg-[var(--custom-blue)] h-[57px] w-[194px] rounded-[5px] text-white text-xl font-normal flex justify-center items-center mt-5' onClick={() => router.push("/create-study")}>Create Study</button>
                    </div>
                </div>
            </div>

            <div className='pt-5'>
                <Table columns={columns} data={quizzData} />
            </div>

        </div>
    )
}

export default isAuth(StudyManagement)