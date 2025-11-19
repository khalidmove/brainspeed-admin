import React, { useMemo, useState, useEffect, useContext } from 'react'
import { Api } from '@/services/service';
import { useRouter } from "next/router";
import moment from 'moment';
import isAuth from '@/components/isAuth';
import { MdOutlineDelete } from 'react-icons/md'
import { FaRegEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { userContext } from './_app';
import Table2,{ indexID } from '@/components/table2';


function LeaderBord(props) {
    const router = useRouter();
    const [quizzData, setQuizzData] = useState([]);
    const [user, setUser] = useContext(userContext);
     const [currentPage, setCurrentPage] = useState(1);
        const [pageSize, setPageSize] = useState(10); // default limit
    
      const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: pageSize,
      });

    useEffect(() => {
        getQuizz(currentPage, pageSize)
    }, [currentPage, pageSize]);

    const getQuizz = (page = 1, limit = 10) => {
        props.loader(true);
        Api("get", `quizz/getAllRankedQuizzes?page=${page}&limit=${limit}`, "", router).then(
            async (res) => {
                props.loader(false);
                if (res?.success) {
                    console.log(res);
                    setQuizzData(res.data);
                     setPagination({
                      ...res?.pagination,
                     itemsPerPage: pageSize, // force override to match dropdown
                    });
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
                    Api("delete", `quizz/delete/${id}`, '', router).then(
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
function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}m ${seconds}s`;
}

    const columns = useMemo(
        () => [
            {
                Header: "#",
                Cell: indexID
            },

            {
                Header: "Test Name",
                accessor: "name",
                Cell: ({ value }) => (
                    <div className="flex flex-col items-center justify-start">
                        <p className="text-black text-base font-normal">{value}</p>
                    </div>
                ),
            },
            {
                Header: "Quiz Date",
                accessor: "scheduledDate",
                Cell: ({ value }) => (
                    <div className="flex flex-col items-center justify-start">
                        <p className="text-black text-base font-normal">{moment(value).format('DD-MMM-YYYY')}</p>
                    </div>
                ),
            },
            {
                Header: "Quiz Time",
                accessor: "scheduledTime",
                Cell: ({ value }) => (
                    <div className="flex flex-col items-center justify-start">
                        <p className="text-black text-base font-normal">{value}</p>
                    </div>
                ),
            },
            {
                Header: "Winers",
                accessor: "users",
                Cell: ({ value }) => (
                    <div className="flex flex-col items-center justify-start">
                        {value && value.length > 0 && value.map((user, index) => (
                        <p className="text-black text-base font-normal">{user?.rank}.{user?.user?.name} — {formatTime(user?.totalTimeTaken)}</p>))}
                    </div>
                ),
            },
            // {
            //     Header: "Image",
            //     accessor: "image",
            //     Cell: ({ value }) => (
            //         <div className="flex flex-col items-startß justify-start">
            //             <img
            //                 src={value}
            //                 alt="Product"
            //                 className="h-12 w-12 rounded-[10px]"
            //             />
            //         </div>
            //     ),
            // },

            // {
            //     Header: "Action",
            //     Cell: ({ value, row }) => (
            //         < div className='flex gap-1'>
            //             <button
            //                 onClick={() => { router.push(`/create-test?id=${row?.original?._id}`) }}
            //                 className='h-10 w-10 bg-[var(--custom-blue)] flex justify-center items-center rounded font-nunito'><FaRegEdit className='h-5 w-5 text-white' /></button>
            //             <button
            //                 onClick={() => { Alert(row?.original?._id); }}
            //                 className='h-10 w-10 bg-[var(--custom-blue)] flex justify-center items-center rounded font-nunito'><MdOutlineDelete className='h-5 w-5 text-white' /></button>
            //         </div >
            //     ),
            // },
        ],
        []
    );




    return (
        <div className="bg-white min-h-full py-10 px-5">
            <div className='border-2 rounded-[15px] border-[var(--dark-blue)] p-5'>
                <div className='md:flex justify-between'>
                    <div>
                        <p className='text-2xl font-bold text-black MerriweatherSans'>{`${moment(new Date()).format('DD-MMM-YYYY')} , ${moment(new Date()).format('dddd')}`}</p>
                        <p className='md:text-4xl text-3xl font-bold text-black MerriweatherSans pt-2'>Hello <span className='text-[var(--dark-orange)]'>{user?.name}</span></p>
                    </div>
                    {/* <div>
                        <button className='bg-[var(--custom-blue)] h-[57px] w-[194px] rounded-[5px] text-white text-xl font-normal flex justify-center items-center mt-5' onClick={() => router.push("/create-test")}>Add Quizz</button>
                    </div> */}
                </div>
            </div>

            <div className='pt-5'>
                {/* <Table columns={columns} data={quizzData} /> */}
                <Table2
                            columns={columns}
                            data={quizzData}
                            pagination={pagination}
                            onPageChange={(page) => setCurrentPage(page)}
                            currentPage={currentPage}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                          />
            </div>

        </div>
    )
}

export default isAuth(LeaderBord)