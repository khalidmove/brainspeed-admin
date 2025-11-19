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
import Table2 from '@/components/table2';


function NotificationHistory(props) {
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
        getNotihistry(currentPage, pageSize)
    }, [currentPage, pageSize]);

    const getNotihistry = (page = 1, limit = 10) => {
        props.loader(true);
        Api("get", `notification/getnotificationForAdmin?page=${page}&limit=${limit}`, "", router).then(
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

    const columns = useMemo(
        () => [
            {
                Header: "#",
                Cell: indexID
            },

            {
                Header: "Title",
                accessor: "title",
                Cell: ({ value }) => (
                    <div className="flex flex-col items-startß justify-start">
                        <p className="text-black text-base font-normal">{value}</p>
                    </div>
                ),
            },
            {
                Header: "Description",
                accessor: "description",
                Cell: ({ value }) => (
                    <div className="flex flex-col items-startß justify-start whitespace-normal">
                        <p className="text-black text-base font-normal">{value}</p>
                    </div>
                ),
            },
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

export default isAuth(NotificationHistory)