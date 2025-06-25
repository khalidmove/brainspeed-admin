import React, { useRef, useState, useEffect, useContext } from 'react'
import { Uploader } from "uploader"; // Installed by "react-uploader".
import { UploadButton } from "react-uploader";
import { IoMdCloudUpload } from "react-icons/io";
import { Api } from '@/services/service';
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { MdCancel } from 'react-icons/md'
import { checkForEmptyKeys } from '@/services/InputsNullChecker';
import isAuth from '@/components/isAuth';
import { userContext } from './_app';
import moment from 'moment';
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

function createChapter(props) {
    const router = useRouter();
    const { id } = router.query
    const fileInputField = useRef(null);
    const [content, setContent] = useState('')
    const [subject, setSubject] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [addChapter, setAddChapter] = useState({
        subject: "",
        wholetopictitle: "",
        wholetopicdescription: "",
        subtopics: [
            {
                title: "",
                image: "",
                file: "",
                content: "",
            }
        ]
    });
    const f = useRef(null);
    const [open, setOpen] = useState(false);
    const [addSubjectName, setAddSubjectName] = useState('');
    const [addSubjectIcon, setAddSubjectIcon] = useState('');
    const [user, setUser] = useContext(userContext);

    const handleClose = () => {
        setOpen(false);
    };

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
                    setSubject(res.data);
                    if (id) {
                        getChapterById()
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

    const getChapterById = () => {
        props.loader(true);
        Api("get", `chapter/${id}`, "", router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    console.log(res);
                    setAddChapter({ ...addChapter, ...res.data });
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
            updatechapter()
        } else {
            chapter()
        }
    }

    const chapter = () => {
        props.loader(true);
        Api("post", "add-chapter", addChapter, router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    setSubmitted(false);
                    router.push('/chapter-list')
                    setAddChapter({
                        subject: "",
                        wholetopictitle: "",
                        wholetopicdescription: "",
                        subtopics: [
                            {
                                title: "",
                                image: "",
                                file: "",
                                content: "",
                            }
                        ]
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

    const updatechapter = () => {
        props.loader(true);
        Api("post", `updatechapter/${id}`, addChapter, router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    setSubmitted(false);
                    router.push('/chapter-list')
                    setAddChapter({
                        subject: "",
                        wholetopictitle: "",
                        wholetopicdescription: "",
                        subtopics: [
                            {
                                title: "",
                                image: "",
                                file: "",
                                content: "",
                            }
                        ]
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
        Api("post", "add-subject", data, router).then(
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

    return (
        <div className="bg-white min-h-full py-10 px-5">
            <div className='border-2 rounded-[15px] border-[var(--dark-blue)] p-5'>
                <p className='text-2xl font-bold text-black MerriweatherSans'>{`${moment(new Date()).format('DD-MMM-YYYY')} , ${moment(new Date()).format('dddd')}`}</p>
                <p className='md:text-4xl text-3xl font-bold text-black MerriweatherSans pt-2'>Hello <span className='text-[var(--dark-orange)]'>{user?.fullName}</span></p>
            </div>

            <form className='border-2 border-[var(--dark-orange)] rounded-[15px] w-full mt-5 p-5 bg-[var(--dark-lightBlue)]' onSubmit={hanledForm}>
                <p className='text-black font-medium text-2xl'>Upload <span className='text-[var(--dark-orange)]'>Chapter</span></p>
                <div className='pt-3'>
                    <select value={addChapter.subject}
                        required
                        onChange={(text) => {
                            if (text.target.value === 'add') {
                                setOpen(true);
                            } else {
                                setAddChapter({
                                    ...addChapter,
                                    subject: text.target.value,
                                });
                            }

                        }} className='bg-white p-2 rounded-[7px] outline-none text-black text-bas	font-bold md:mb-0 mb-2 border border-[var(--custom-blue)] md:w-60 w-full' placeholder='Select Semester'>
                        <option className='p-5' value={''}>Select Main Subject</option>

                        {subject?.map((item, i) => (
                            <option key={i} value={item?._id} className='p-5'>{item?.name}</option>
                        ))}
                        <option className='p-5 text-[var(--dark-orange)] font-bold' value={'add'}>+ Add Subject</option>
                    </select>
                    {submitted && addChapter.subject === "" && (
                        <p className="text-red-700 mt-1">Select Main Subject is required</p>
                    )}
                </div>

                <div className='grid grid-cols-2 w-full gap-5 pt-5'>
                    <div className="grid grid-cols-1 ">
                        <p className="text-black text-lg font-semibold">Topic Title</p>
                        <input
                            className="outline-none p-2 w-full  border border-[var(--custom-blue)] rounded-[7px] bg-white"
                            type="text"
                            placeholder="Topic Title"
                            value={addChapter.wholetopictitle}
                            required
                            onChange={(text) => {
                                setAddChapter({
                                    ...addChapter,
                                    wholetopictitle: text.target.value,
                                });
                            }}
                        />
                        {submitted && addChapter.wholetopictitle === "" && (
                            <p className="text-red-700 mt-1">Topic Title is required</p>
                        )}
                    </div>
                    <div className="grid grid-cols-1">
                        <p className="text-black text-lg font-semibold">Topic Description</p>
                        <textarea
                            className="outline-none p-2 w-full  border border-[var(--custom-blue)] rounded-[7px] bg-white"
                            type="text"
                            rows={1}
                            placeholder="Topic Description"
                            value={addChapter.wholetopicdescription}
                            required
                            onChange={(text) => {
                                setAddChapter({
                                    ...addChapter,
                                    wholetopicdescription: text.target.value,
                                });
                            }}
                        ></textarea>
                        {submitted && addChapter.wholetopicdescription === "" && (
                            <p className="text-red-700 mt-1">Topic Description is required</p>
                        )}
                    </div>
                </div>

                {addChapter?.subtopics?.map((item, i) => (
                    <div key={i}>
                        <p className='text-black text-xl font-semibold my-5'>Sub Topic - {i + 1}</p>
                        <div className='border-2 border-[var(--dark-orange)] rounded-[15px] p-5'>
                            <div className="pb-5">
                                <p className="text-black text-lg font-semibold">Title</p>
                                <input
                                    className="outline-none p-2 w-full  border border-[var(--custom-blue)] rounded-[7px] bg-white"
                                    type="text"
                                    placeholder="title"
                                    value={item?.title}
                                    required
                                    onChange={(text) => {
                                        item.title = text.target.value;
                                        setAddChapter({
                                            ...addChapter,
                                            subtopics: [...addChapter.subtopics],
                                        });
                                    }}
                                />
                                {submitted && item.title === "" && (
                                    <p className="text-red-700 mt-1">Title is required</p>
                                )}
                            </div>

                            <div>
                                <p className="text-black text-lg font-semibold">Content</p>
                                <div className='border border-[var(--custom-blue)] rounded-[7px] py-5 px-3 bg-white'>
                                    <JoditEditor
                                        className="editor max-h-screen overflow-auto"
                                        //   ref={editor}
                                        // config={
                                        //     {
                                        //         required: true
                                        //     }
                                        // }
                                        rows={5}
                                        value={item.content}
                                        onChange={newContent => {
                                            item.content = newContent;
                                            setAddChapter({
                                                ...addChapter,
                                                subtopics: [...addChapter.subtopics],
                                            });
                                        }}
                                    />
                                </div>
                                {submitted && item.content === "" && (
                                    <p className="text-red-700 mt-1">Content is required</p>
                                )}
                            </div>

                            <div className='grid md:grid-cols-5 grid-cols-1 md:gap-5 w-full'>
                                <div className='col-span-4 w-full md:mt-10 mt-5 md:mb-[15px] mb-5'>
                                    <div className='relative  border-2 border-dashed border-[var(--custom-blue)] py-[35px] px-5 rounded-md flex flex-col   items-center bg-white'>
                                        <img src='/uploadImg.png' className='h-[60px] w-[60px]' />
                                        <p className='text-[var(--custom-blue)] font-normal	text-base text-center'>Drag file here or Browse file for Upload</p>
                                        <input
                                            className='text-lg block w-full	border-none	normal-case absolute top-0 left-0 right-0 bottom-0 opacity-0'
                                            type="file"
                                            ref={fileInputField}
                                            // onChange={handleNewFileUpload}
                                            title=""
                                            // value=""
                                            // value={item.image}
                                            onChange={event => {
                                                const file = event.target.files[0];
                                                const reader = new FileReader();
                                                let key = event.target.name;
                                                reader.onloadend = () => {
                                                    const base64 = reader.result;
                                                    console.log(base64);
                                                    item.image = base64;
                                                    setAddChapter({
                                                        ...addChapter,
                                                        subtopics: [...addChapter.subtopics],
                                                    });
                                                    //   setUserDetail({ ...userDetail, userimg: base64, profile: file });
                                                };

                                                if (file) {
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />

                                    </div>
                                    {submitted && item.image === "" && (
                                        <p className="text-red-700 mt-1">Image is required</p>
                                    )}
                                </div>
                                <div className='flex flex-col justify-center items-center md:mt-10 mt-5 md:mb-[15px] mb-5'>
                                    <button className='bg-[var(--custom-blue)] h-[52px]  rounded-[7px] w-full text-white text-base font-normal flex justify-center items-center'
                                        onClick={() => {
                                            f.current.click();
                                        }}>
                                        <input
                                            type="file"
                                            ref={f}
                                            className="hidden"
                                            onChange={(event) => {
                                                const file = event.target.files[0];
                                                const reader = new FileReader();
                                                let key = event.target.name;
                                                reader.onloadend = () => {
                                                    const base64 = reader.result;
                                                    console.log(base64);
                                                    item.file = base64;
                                                    setAddChapter({
                                                        ...addChapter,
                                                        subtopics: [...addChapter.subtopics],
                                                    });
                                                    //   setUserDetail({ ...userDetail, userimg: base64, profile: file });
                                                };

                                                if (file) {
                                                    reader.readAsDataURL(file);
                                                }

                                            }}
                                        />
                                        <img className='h-[25px] w-[25px] mr-5' src='/uploadDoc.png' />
                                        Upload doc</button>
                                    {submitted && item.image === "" && (
                                        <p className="text-red-700 mt-1">File is required</p>
                                    )}
                                    <button className='bg-[var(--custom-blue)] h-[52px] md:w-full w-full rounded-[7px] text-white text-base font-normal flex justify-center items-center md:mt-5 mt-5' onClick={() => {
                                        // chapter()
                                        setAddChapter({
                                            ...addChapter,
                                            subtopics: [
                                                ...addChapter.subtopics,
                                                { title: "", image: "", file: "", content: "" },
                                            ],
                                        });
                                    }}>Add sub topic</button>
                                    <button className='bg-[var(--custom-blue)] h-[52px] md:w-full w-full rounded-[7px] text-white text-base font-normal flex justify-center items-center md:mt-5 mt-5'
                                        onClick={() => {
                                            if (addChapter?.subtopics?.length === 1) {
                                                addChapter.subtopics.splice(i, 1)
                                                addChapter.subtopics.push({ title: "", image: "", file: "", content: "" })
                                                console.log(addChapter)
                                                setAddChapter({ ...addChapter })
                                            } else {
                                                addChapter.subtopics.splice(i, 1)
                                                console.log(addChapter)
                                                setAddChapter({ ...addChapter })
                                            }
                                        }}>Remove sub topic</button>

                                </div>
                            </div>
                        </div>
                    </div>))}

                <div>
                    {/* <button className='bg-[var(--custom-blue)] h-[52px] md:w-60 w-full rounded-[7px] text-white text-base font-normal flex justify-center items-center md:mt-0 mt-5' onClick={chapter}>Add sub topic</button> */}
                    {!id && <button className='bg-[var(--custom-blue)] h-[52px] md:w-60 w-full rounded-[7px] text-white text-base font-normal flex justify-center items-center md:mt-5 mt-5' type="submit">Submit</button>}
                    {id && <button className='bg-[var(--custom-blue)] h-[52px] md:w-60 w-full rounded-[7px] text-white text-base font-normal flex justify-center items-center md:mt-5 mt-5' type="submit">Update</button>}
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
        </div>
    )
}

export default isAuth(createChapter)