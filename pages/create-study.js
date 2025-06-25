import React, { useState, useEffect, useRef, useContext } from 'react'
import { useRouter } from "next/router";
import { Api } from '@/services/service';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { MdCancel } from 'react-icons/md'
import isAuth from '@/components/isAuth';
import { userContext } from './_app';
import moment from 'moment';
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });
import dynamic from "next/dynamic";

function CreateStudy(props) {
    const router = useRouter();
    const { id } = router.query
    const [subject, setSubject] = useState([]);
    const [quizzId, setQuizzId] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [open, setOpen] = useState(false);
    const [topic, setTopic] = useState(false);
    const [addSubjectName, setAddSubjectName] = useState('');
    const [addSubjectIcon, setAddSubjectIcon] = useState('');
    const [addTopicName, setAddTopicName] = useState('');
    const [topicData, setTopicData] = useState([])
    const fileInputField = useRef(null);
    const [user, setUser] = useContext(userContext);
    const [addQuestions, setAddQuestions] = useState({
        subject: "",
        content: "",
        topic: "",
    });

    useEffect(() => {
        getSubject()
    }, []);

    console.log(topicData)

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseTopic = () => {
        setTopic(false);
    };

    const gettpoicbysubject = (sub_id) => {
        props.loader(true);
        Api("get", `getchapterbysubject/${sub_id}`, "", router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    console.log(res);
                    setTopicData(res.data);
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

    const hanledForm = (e) => {
        e.preventDefault();
        if (id) {
            updatequizz()
        } else {
            addQuizz()
        }
    }

    const addQuizz = () => {
        props.loader(true);
        Api("post", "add-study", addQuestions, router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    setSubmitted(false);
                    router.push('/study-management')
                    setAddQuestions({
                        subject: "",
                        content: "",
                        time: "", //in minutes
                        // questions: [
                        //     {
                        //         que: "",
                        //         ans: "",
                        //         reason: "",
                        //         option: [
                        //             {
                        //                 title: "",
                        //                 isTrue: false,
                        //                 sign: "A"
                        //             },
                        //             {
                        //                 title: "",
                        //                 isTrue: false,
                        //                 sign: "B"
                        //             },
                        //             {
                        //                 title: "",
                        //                 isTrue: false,
                        //                 sign: "C"
                        //             },
                        //             {
                        //                 title: "",
                        //                 isTrue: false,
                        //                 sign: "D"
                        //             },
                        //         ]
                        //     }
                        // ]
                    });
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

    const updatequizz = () => {
        props.loader(true);
        Api("post", `updatestudy/${id}`, addQuestions, router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    setSubmitted(false);
                    router.push('/study-management')
                    setAddQuestions({
                        subject: "",
                        content: "",
                        time: "", //in minutes
                        // questions: [
                        //     {
                        //         que: "",
                        //         ans: "",
                        //         reason: "",
                        //         option: [
                        //             {
                        //                 title: "",
                        //                 isTrue: false,
                        //                 sign: "A"
                        //             },
                        //             {
                        //                 title: "",
                        //                 isTrue: false,
                        //                 sign: "B"
                        //             },
                        //             {
                        //                 title: "",
                        //                 isTrue: false,
                        //                 sign: "C"
                        //             },
                        //             {
                        //                 title: "",
                        //                 isTrue: false,
                        //                 sign: "D"
                        //             },
                        //         ]
                        //     }
                        // ]
                    });
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

    const getSubject = () => {
        props.loader(true);
        Api("get", "get-subject", "", router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    console.log(res);
                    setSubject(res.data);
                    if (id) {
                        getQuizzById()
                    }
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

    const getQuizzById = () => {
        props.loader(true);
        Api("get", `getstudyById/${id}`, "", router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    console.log(res);
                    setAddQuestions(res.data);
                    gettpoicbysubject(res.data.subject)
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
        Api("post", "add-study", data, router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    setOpen(false)
                    getSubject()
                    setAddSubjectName('');
                    setAddSubjectIcon('')
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

    const addTopic = () => {
        if (!addTopicName) {
            props.toaster({ type: "error", message: 'Topic Name is required' });
            return;
        }
        props.loader(true);
        const data = {
            wholetopictitle: addTopicName,
            subject: addQuestions.subject,
            "subtopics": [{
                "title": "",
                "image": "",
                "file": "",
                "content": ""
            }]
        }
        Api("post", "add-chapter", data, router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    setTopic(false)
                    // getSubject()
                    gettpoicbysubject(addQuestions.subject)
                    setAddTopicName('');
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

    console.log(addQuestions)

    return (
        <div className="bg-white min-h-full py-10 px-5">
            <div className='border-2 rounded-[15px] border-[var(--dark-blue)] p-5'>
                <p className='text-2xl font-bold text-black MerriweatherSans'>{`${moment(new Date()).format('DD-MMM-YYYY')} , ${moment(new Date()).format('dddd')}`}</p>
                <p className='md:text-4xl text-3xl font-bold text-black MerriweatherSans pt-2'>Hello <span className='text-[var(--dark-orange)]'>{user?.fullName}</span></p>
            </div>

            <form className='border-2 border-[var(--dark-orange)] rounded-[15px] w-full mt-5 p-5 bg-[var(--dark-lightBlue)]' onSubmit={hanledForm}>

                <div className='grid md:grid-cols-2 grid-cols-1 w-full md:gap-5'>
                    <div>
                        <p className='text-black font-medium text-2xl'>Add <span className='text-[var(--dark-orange)]'>Content</span></p>
                        <div className='pt-3'>
                            <select value={addQuestions.subject}
                                // required
                                onChange={(text) => {
                                    if (text.target.value === 'add') {
                                        setOpen(true);
                                    } else {
                                        setAddQuestions({
                                            ...addQuestions,
                                            subject: text.target.value,
                                        });
                                        console.log(text.target.value)
                                        gettpoicbysubject(text.target.value)
                                    }

                                }} className='bg-white p-2 rounded-[7px] outline-none text-black text-bas	font-bold md:mb-0 mb-2 border border-[var(--custom-blue)] md:w-full w-full' placeholder='Select Main Subject'>
                                <option className='p-5' value={''}>Select Main Subject</option>

                                {subject?.map((item, i) => (
                                    <option key={i} value={item?._id} className='p-5'>{item?.name}</option>
                                ))}
                                <option className='p-5 text-[var(--dark-orange)] font-bold' value={'add'}>+ Add Subject</option>
                            </select>
                            {submitted && addQuestions.subject === "" && (
                                <p className="text-red-700 mt-1">Select Main Subject is required</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <p className='text-black font-medium text-2xl'>Topic</p>
                        <div className='pt-3'>
                            <select value={addQuestions.topic}
                                // required
                                onChange={(text) => {
                                    if (text.target.value === 'add') {
                                        if (addQuestions.subject === '') {
                                            props.toaster({ type: "error", message: 'Subject is required' });
                                            return
                                        }
                                        setTopic(true);
                                    } else {
                                        setAddQuestions({
                                            ...addQuestions,
                                            topic: text.target.value,
                                        });
                                    }

                                }} className='bg-white p-2 rounded-[7px] outline-none text-black text-bas	font-bold md:mb-0 mb-2 border border-[var(--custom-blue)] md:w-full w-full' placeholder='Select Main Subject'>
                                <option className='p-5' value={''}>Select Topic</option>

                                {topicData?.map((item, i) => (
                                    <option key={i} value={item?._id} className='p-5'>{item?.wholetopictitle}</option>
                                ))}
                                <option className='p-5 text-[var(--dark-orange)] font-bold' value={'add'}>+ Add Topic</option>
                            </select>
                            {submitted && addQuestions.subject === "" && (
                                <p className="text-red-700 mt-1">Select Topic is required</p>
                            )}
                        </div>
                    </div>


                </div>

                {/* {addQuestions?.questions?.map((item, i) => ( */}
                <div className=' w-full mt-5 py-5'>

                    <div className='grid md:grid-cols-6 grid-cols-1 gap-5 w-full'>
                        <div className='col-span-6'>
                            <p className='text-[var(--dark-orange)] font-medium text-2xl pb-5'>Explanation</p>
                            <JoditEditor
                                className="editor max-h-screen overflow-auto !rounded-[5px]"
                                rows={10}
                                value={addQuestions?.content}
                                onChange={newContent => {
                                    setAddQuestions({
                                        ...addQuestions,
                                        content: newContent
                                    });
                                }}
                            />
                        </div>
                    </div>
                </div>
                {/* ))} */}

                <div className='flex md:justify-start justify-center md:items-start items-center'>
                    {!id && <button className='bg-[var(--custom-blue)] h-[52px] w-60 rounded-[7px] text-white text-base font-normal flex justify-center items-center mt-5' type="submit">Submit</button>}
                    {id && <button className='bg-[var(--custom-blue)] h-[52px] w-60 rounded-[7px] text-white text-base font-normal flex justify-center items-center mt-5' type="submit">Update</button>}
                </div>
            </form>

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
                        {/* <DialogActions className='!p-0 !flex !justify-center !items-center'></DialogActions> */}
                    </div>
                </Dialog>
            </div>

            <div className="">
                <Dialog
                    open={topic}
                    onClose={handleCloseTopic}
                    aria-labelledby="draggable-dialog-title"
                >
                    <div className='md:w-[400px] w-[330px]'>
                        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
                            <div className='flex justify-end items-end absolute right-[5px] top-[5px]'>
                                <MdCancel onClick={handleCloseTopic} className='h-8 w-8' />
                            </div>
                        </DialogTitle>
                        <DialogContent>
                            <div className="">
                                <p className="text-black text-lg font-semibold">Topic Name</p>
                                <input
                                    className="outline-none p-2 w-full  border border-[var(--custom-blue)] rounded-[7px] bg-white"
                                    type="text"
                                    placeholder="Name"
                                    value={addTopicName}
                                    onChange={(text) => {
                                        setAddTopicName(text.target.value);
                                    }}
                                />

                            </div>
                            <button className='bg-[var(--custom-blue)] h-[45px] w-full rounded-[7px] text-white text-base font-normal flex justify-center items-center md:mt-5 mt-5' onClick={addTopic}>Submit</button>
                        </DialogContent>
                        {/* <DialogActions className='!p-0 !flex !justify-center !items-center'></DialogActions> */}
                    </div>
                </Dialog>
            </div>
        </div>
    )
}

export default isAuth(CreateStudy)
