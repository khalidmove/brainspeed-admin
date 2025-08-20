import React, { useContext, useEffect, useState } from 'react'
import moment from 'moment';
import { userContext } from './_app';
import { Api } from '@/services/service';
import { useRouter } from "next/router";
import { FiEdit } from "react-icons/fi";
import { IoCloseCircleOutline } from "react-icons/io5";
import Swal from "sweetalert2";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';


function TimeSlot(props) {
    const router = useRouter();
    const [user, setUser] = useContext(userContext);
    const [data, setData] = useState({
        startTime: dayjs(new Date()),
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [loadTypeData, setloadTypeData] = useState([]);
    const [editid, seteditid] = useState("");

    useEffect(() => {
        getAllTimeSlots();
    }, []);

    const getAllTimeSlots = async () => {
        props.loader(true);
        Api("get", "time/getAllTimeSlots?type=admin", "", router).then(
            (res) => {
                props.loader(false);
                console.log("res================> form data :: ", res);
                setloadTypeData(res.data.timeSlots);
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    };

    const submit = (e) => {
        e.preventDefault();
        let method = "post";
        let url = "time/createTimeSlot";
        let datas = {
            ...data,
            startTime: moment(new Date(data.startTime)).format('hh:mm a')
        }
        if (editid) {
            datas.id = data._id;
            url = `time/updateTimeSlot/${editid}`;
            method = "post";
        }


        createUpdateApi(method, url, datas)
    };

    const createUpdateApi = (method, url, datas) => {
        Api(method, url, datas, router).then(
            (res) => {
                console.log("Post truck type", res);
                getAllTimeSlots();
                seteditid("");
            },
            (err) => {
                console.log(err);
                props.loader(false);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    }

    const deleteTimeSlot = (_id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to proceed with the deletion?",
            icon: "warning",
            showCancelButton: true,
            cancelButtonColor: "#d33",
            confirmButtonText: "Delete",
        }).then(function (result) {
            console.log(result);
            if (result.isConfirmed) {
                const data = {
                    _id,
                };

                props.loader(true);
                Api("delete", `time/deleteTimeSlot/${_id}`, data, router).then(
                    (res) => {
                        console.log("res================>", res.data?.meaasge);
                        props.loader(false);
                        getAllTimeSlots();
                    },
                    (err) => {
                        props.loader(false);
                        console.log(err);
                        props.toaster({ type: "error", message: err?.data?.meaasge });
                        props.toaster({ type: "error", message: err?.meaasge });
                    }
                );
            } else if (result.isDenied) {
                // setFullUserDetail({})
            }
        });
    };

    return (
        <div className="bg-white min-h-full md:pt-10 pt-11 md:pb-10 pb-5 px-5">
            <div className='border-2 rounded-[15px] border-[var(--dark-blue)] p-5'>
                <div className='md:flex justify-between'>
                    <div>
                        <p className='text-2xl font-bold text-black MerriweatherSans'>{`${moment(new Date()).format('DD-MMM-YYYY')} , ${moment(new Date()).format('dddd')}`}</p>
                        <p className='md:text-4xl text-3xl font-bold text-black MerriweatherSans pt-2'>Hello <span className='text-[var(--dark-orange)]'>{user?.name}</span></p>
                    </div>
                </div>
            </div>

            <section className="h-full w-full  md:mt-0 mt-5 md:pb-32 pb-28">
                {/* overflow-scroll no-scrollbar */}
                <form className="bg-white border md:my-10 border-custom-lightsGrayColor rounded-[10px] p-5" onSubmit={submit}>

                    <div className="md:flex flex-col justify-center items-center pt-10">
                        <div className="flex flex-col justify-start items-start md:w-auto w-full">
                            {/* <p className="text-custom-lightGrayInputName text-sm font-semibold pb-2">Add Start Time</p> */}

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['TimePicker']}>
                                    <TimePicker label="Start Time"
                                        value={data.startTime}
                                        onChange={(e) => {
                                            console.log(e.$d)
                                            setData({ ...data, startTime: dayjs(new Date(e.$d)) });
                                        }}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>

                        </div>
                    </div>

                    <div className="flex justify-center items-center pt-5 pb-3">
                        <button className="md:h-[40px] h-[40px] md:w-[250px] w-full bg-[var(--custom-blue)] rounded-[10px] md:text-lg text-base text-white" type="submit">{editid ? "Update Now" : "Add Now"} </button>
                    </div>
                </form>

                {/* Form code end here */}

                {/* <div className="bg-white border border-custom-lightsGrayColor rounded-[10px] p-5 ">
                    <input className="bg-custom-lightGrayInputBg text-custom-black border border-custom-lightGrayColor outline-none h-[40px] md:w-[435px] w-full px-5 rounded-[10px] text-custom-darkBlack font-semibold	text-base"
                        type="text"
                        placeholder="Search Category"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} />
                </div> */}

                {loadTypeData.map((item, i) => (
                    <div key={i} className="bg-white border border-custom-lightsGrayColor rounded-[10px] p-5 mt-5">
                        <div className="grid grid-cols-2 justify-between items-center w-full">
                            <div className="flex justify-start items-center">
                                <input className="md:h-[30px] h-[15px] md:w-[30px] w-[15px]"
                                    checked={item.status}
                                    type="checkbox"
                                    onChange={() => {
                                        let method = "post";
                                        let url = `time/updateTimeSlot/${item?._id}`;
                                        const d = {
                                            status: !item.status,
                                            // id: item._id
                                        }
                                        createUpdateApi(method, url, d)
                                    }}
                                />
                                <p className={`text-base text-black font-semibold pl-5`}>{item?.startTime}</p>
                            </div>

                            <div className="flex justify-end items-end">
                                <FiEdit className={`md:h-[30px] h-[20px] md:w-[30px] w-[20px] text-custom-darkGray mr-[20px] cursor-pointer`}
                                    onClick={() => {
                                        console.log(item)
                                        seteditid(item._id);
                                        setData({
                                            startTime: dayjs(new Date(moment(item.startTime, 'hh:mm a').format()))
                                        });
                                    }} />
                                <IoCloseCircleOutline
                                    className={`md:h-[30px] h-[20px] md:w-[30px] w-[20px] text-custom-darkGray cursor-pointer`}
                                    onClick={() => {
                                        deleteTimeSlot(item?._id);
                                    }} />
                            </div>
                        </div>
                    </div>
                ))}
            </section>

        </div>
    )
}

export default TimeSlot
