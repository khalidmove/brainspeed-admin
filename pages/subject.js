import React, { useMemo, useState, useEffect, useContext } from 'react'
import Table, { indexID } from "@/components/table";
import { Api } from '@/services/service';
import { useRouter } from "next/router";
import moment from 'moment';
import isAuth from '@/components/isAuth';
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from 'react-icons/md'
import Swal from "sweetalert2";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { MdCancel } from 'react-icons/md'
import { userContext } from './_app';

function Subject(props) {
    const router = useRouter();
    const [chapterData, setChapterData] = useState([]);
    const [open, setOpen] = useState(false);
    const [addSubjectName, setAddSubjectName] = useState('');
    const [addSubjectIcon, setAddSubjectIcon] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const [user, setUser] = useContext(userContext);

    useEffect(() => {
        getSubject()
    }, []);

    const getSubject = () => {
        props.loader(true);
        Api("get", "get-subject", "", router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    console.log(res);
                    setChapterData(res.data);
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

    const handleClose = () => {
        setOpen(false);
    };

    const addSubject = () => {
        if (!addSubjectName) {
            props.toaster({ type: "error", message: 'Subject Name is required' });
            return;
        }

        if (!addSubjectIcon) {
            props.toaster({ type: "error", message: 'Subject Icon is required' });
            return;
        }
        props.loader(true);
        const data = {
            name: addSubjectName,
            icon: addSubjectIcon
        }
        let Url = 'add-subject'
        if (subjectId) {
            Url = `update-subject/${subjectId}`
        }
        Api("post", Url, data, router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    setOpen(false)
                    getSubject()
                    setAddSubjectName('');
                    setAddSubjectIcon('')
                    setSubjectId('')
                    props.toaster({ type: "success", message: res?.data?.message });
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

    // const Alert = (id, sub_id) => {
    //     Swal.fire({
    //         title: "Are you sure?",
    //         text: "You want to proceed with the deletion?",
    //         icon: "warning",
    //         showCancelButton: true,
    //         cancelButtonColor: "#d33",
    //         confirmButtonText: "Delete"
    //     })
    //         .then(function (result) {
    //             if (result.isConfirmed) {

    //                 props.loader(true);
    //                 Api("delete", `deletechapter/${id}?sub_id=${sub_id}`, '', router).then(
    //                     (res) => {
    //                         console.log("res================>", res);
    //                         props.loader(false);

    //                         if (res?.status) {
    //                             getChapter()
    //                             props.toaster({ type: "error", message: res?.data?.message });
    //                         } else {
    //                             console.log(res?.data?.message);
    //                             props.toaster({ type: "error", message: res?.data?.message });
    //                         }
    //                     },
    //                     (err) => {
    //                         props.loader(false);
    //                         console.log(err);
    //                         props.toaster({ type: "error", message: err?.message });
    //                     }
    //                 );
    //             } else if (result.isDenied) {
    //                 // setFullUserDetail({})
    //             }

    //         });
    // };

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
                Header: "Name",
                accessor: 'name',
                Cell: name
            },
            {
                Header: "Icon",
                accessor: 'icon',
                Cell: title
            },

            {
                Header: "ACTION",
                Cell: Action,
            },
        ],
        []
    );

    function dataFormet({ row }) {
        return (
            < div>
                <p className='text-black text-base font-normal'>{moment(row?.original?.createdAt).format('DD-MM-YYYY')}</p>
            </div>
        )
    }

    function name({ value, row }) {

        return (
            < div>
                <p className='text-black text-base font-normal  flex-wrap whitespace-normal w-56'>{value}</p>
            </div>
        )
    }

    function title({ value }) {

        return (
            < div>
                {value && <img className='w-20 h-20' src={value} />}
            </div>
        )
    }

    function Action({ row }) {

        return (
            < div className='flex gap-3'>
                <button
                    onClick={() => {
                        setOpen(true)
                        setAddSubjectName(row.original?.name)
                        setAddSubjectIcon(row.original?.icon || '')
                        setSubjectId(row.original?._id)
                    }}
                    className='h-10 w-10 bg-[var(--custom-blue)] flex justify-center items-center rounded font-nunito'><FaRegEdit className='h-5 w-5 text-white' /></button>
                {/* <button
                    onClick={() => { Alert(row?.original?._id, row?.original?.subject?._id); }}
                    className='h-10 w-10 bg-[var(--custom-blue)] flex justify-center items-center rounded font-nunito'><MdOutlineDelete className='h-5 w-5 text-white' /></button> */}
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
                        <button className='bg-[var(--custom-blue)] h-[57px] w-[194px] rounded-[5px] text-white text-xl font-normal flex justify-center items-center mt-5' onClick={() => setOpen(true)}>Add Subject</button>
                    </div>
                </div>
            </div>

            <div className='pt-5'>
                <Table columns={columns} data={chapterData} />
            </div>

            <div className="">
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="draggable-dialog-title"
                >
                    <div className='md:w-[400px] w-[330px]'>
                        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
                            <div className='flex justify-end items-end absolute right-[5px] top-[5px]'>
                                <MdCancel onClick={handleClose} className='h-8 w-8' />
                            </div>
                        </DialogTitle>
                        <DialogContent>
                            <div className="">
                                <p className="text-black text-lg font-semibold">Subject Name</p>
                                <input
                                    className="outline-none p-2 w-full  border border-[var(--custom-blue)] rounded-[7px] bg-white"
                                    type="text"
                                    placeholder="Name"
                                    value={addSubjectName}
                                    onChange={(text) => {
                                        setAddSubjectName(text.target.value);
                                    }}
                                />
                            </div>
                            <div className="pt-5">
                                <p className="text-black text-lg font-semibold">Icon</p>
                                <input
                                    className="outline-none p-2 w-full  border border-[var(--custom-blue)] rounded-[7px] bg-white"
                                    type="text"
                                    placeholder="Icon Url"
                                    value={addSubjectIcon}
                                    onChange={(text) => {
                                        setAddSubjectIcon(text.target.value);
                                    }}
                                />
                            </div>
                            <button className='bg-[var(--custom-blue)] h-[45px] w-full rounded-[7px] text-white text-base font-normal flex justify-center items-center md:mt-5 mt-5' onClick={addSubject}>Submit</button>
                        </DialogContent>
                    </div>
                </Dialog>
            </div>
        </div>
    )
}

export default isAuth(Subject)