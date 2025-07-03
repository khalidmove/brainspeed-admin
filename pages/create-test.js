import React, { useState, useEffect, useRef, useContext, useMemo } from 'react'
import { useRouter } from "next/router";
import { Api } from '@/services/service';
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
import dynamic from "next/dynamic";
import Table from '@/components/table';
import { MdOutlineDelete } from 'react-icons/md'
import { FaRegEdit } from "react-icons/fa";

function CreateTest(props) {
    const router = useRouter();
    const { id } = router.query
    const [quizzData, setQuizzData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [testObj, setTestObj] = useState({
        name: '',
        category: '',
        image: '',
        limit: 5
    })

    const [submitted, setSubmitted] = useState(false);
    const [user, setUser] = useContext(userContext);
    const [questionIdList, setQuestionIdList] = useState([]);

    useEffect(() => {
        if (id) {
            getQuizzById()
        }
    }, [id])

    useEffect(() => {
        getcategory()
    }, [])

    const getQuizzById = () => {
        props.loader(true);
        Api("get", `quizz/${id}`, '', router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    console.log(res);
                    const { name, category, image, limit, questions } = res.data
                    setTestObj({
                        name,
                        category,
                        image,
                        limit
                    })
                    setQuizzData(questions)
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
    }


    const getcategory = () => {
        props.loader(true);
        Api("get", `category?status=Active`, '', router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    console.log(res);
                    setCategoryData(res.data)
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
    }

    const hanledForm = (e) => {
        e.preventDefault();
        if (id) {
            updatequizz()
        } else {
            createTesat()
        }
    }

    const getQuizzData = () => {
        if (!testObj.limit || !testObj.category) {
            setSubmitted(true);
            return
        }
        props.loader(true);
        Api("post", `question/fatchRandomeQuestions`, testObj, router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    console.log(res);
                    let questionIdArray = []
                    res.data.map(item => {
                        questionIdArray = questionIdArray.concat(item.que.map(q => q._id))
                    })
                    console.log(questionIdArray)
                    setQuestionIdList(questionIdArray)
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
    }

    const createTesat = () => {
        const data = {
            ...testObj,
            questions: quizzData,
            questionIdList
        }
        props.loader(true);
        Api("post", `quizz/create`, data, router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    console.log(res);
                    setTestObj({
                        name: '',
                        category: '',
                        image: '',
                        limit: 5
                    })
                    setQuizzData([]);
                    router.push(`/test-management`);

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
    }

    const updatequizz = () => {
        const data = {
            ...testObj,
            questions: quizzData,
            id,
        }
        props.loader(true);
        Api("post", `quizz/update`, data, router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    console.log(res);
                    setTestObj({
                        name: '',
                        category: '',
                        image: '',
                        limit: 5
                    })
                    setQuizzData([])
                    router.push(`/test-management`);
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
    }




    return (
        <div className="bg-white min-h-full py-10 px-5">
            <div className='border-2 rounded-[15px] border-[var(--dark-blue)] p-5'>
                <p className='text-2xl font-bold text-black MerriweatherSans'>{`${moment(new Date()).format('DD-MMM-YYYY')} , ${moment(new Date()).format('dddd')}`}</p>
                <p className='md:text-4xl text-3xl font-bold text-black MerriweatherSans pt-2'>Hello <span className='text-[var(--dark-orange)]'>{user?.fullName}</span></p>
            </div>

            <form className='border-2 border-[var(--dark-blue)] rounded-[15px] w-full mt-5 p-5 bg-[var(--dark-lightBlue)]' onSubmit={hanledForm}>

                <div className='grid md:grid-cols-2 grid-cols-1 w-full md:gap-5'>


                    <div>
                        <p className='text-[var(--dark-orange)] font-medium text-lg pb-3'>Test Name</p>
                        <input
                            className="outline-none p-2 w-full  border border-[var(--custom-blue)] rounded-[7px] bg-white"
                            type='text'
                            placeholder="Test Name"
                            min={0}
                            value={testObj.name}
                            required
                            onChange={(text) => {
                                setTestObj({
                                    ...testObj,
                                    name: text.target.value,
                                });
                            }}
                        />
                        {submitted && testObj.name === "" && (
                            <p className="text-red-700 mt-1">Name is required</p>
                        )}
                    </div>

                    <div>
                        <p className='text-[var(--dark-orange)] font-medium text-lg pb-3'>Image</p>
                        <input
                            className="outline-none p-2 w-full  border border-[var(--custom-blue)] rounded-[7px] bg-white"
                            type='text'
                            value={testObj.image}
                            required
                            onChange={(text) => {
                                setTestObj({
                                    ...testObj,
                                    image: text.target.value,
                                });
                            }}
                        />
                        {submitted && testObj.image === "" && (
                            <p className="text-red-700 mt-1">Image is required</p>
                        )}
                    </div>




                </div>


                <div className='grid md:grid-cols-3 grid-cols-1 w-full md:gap-5 p-2 border-2 rounded-md mt-10'>
                    <div>
                        <p className='text-[var(--dark-orange)] font-medium text-lg pb-3'>Category</p>
                        <select
                            value={testObj.category}
                            onChange={(text) => {
                                setTestObj({
                                    ...testObj,
                                    category: text.target.value,
                                });
                            }}
                            className="outline-none p-2 w-full  border border-[var(--custom-blue)] rounded-[7px] bg-white"
                        >
                            <option value=''>Select category</option>
                            {categoryData.map((item, i) => (<option key={i} value={item.name}>{item.name}</option>))}
                        </select>
                        {submitted && testObj.category === "" && (
                            <p className="text-red-700 mt-1">Category is required</p>
                        )}
                    </div>

                    <div>
                        <p className='text-[var(--dark-orange)] font-medium text-lg pb-3'>Question Limit per level</p>
                        <input
                            className="outline-none p-2 w-full  border border-[var(--custom-blue)] rounded-[7px] bg-white"
                            type='number'
                            placeholder="Question limit"
                            min={5}
                            value={testObj.limit}
                            required
                            onChange={(text) => {
                                setTestObj({
                                    ...testObj,
                                    limit: text.target.value,
                                });
                            }}
                        />
                        {submitted && testObj.limit === "" && (
                            <p className="text-red-700 mt-1">Limt is required</p>
                        )}
                    </div>
                    <div className='flex items-end justify-end'>
                        <button className='bg-[var(--custom-blue)] h-[52px] w-60 rounded-[7px] text-white text-base font-normal flex justify-center items-center mt-5' type="button" onClick={getQuizzData}>Fetch Rendom Questions</button>
                    </div>
                </div>
                <div className='flex md:justify-end justify-center md:items-start items-center'>
                    {!id && <button className='bg-[var(--custom-blue)] h-[52px] w-60 rounded-[7px] text-white text-base font-normal flex justify-center items-center mt-5' type="submit">Create</button>}
                    {id && <button className='bg-[var(--custom-blue)] h-[52px] w-60 rounded-[7px] text-white text-base font-normal flex justify-center items-center mt-5' type="submit">Update</button>}
                </div>


            </form>



            {quizzData.map((item, i) => (<div key={i} className='pt-5'>
                <p className="text-black mt-1 font-bold">{item?.level}</p>
                <table className='w-full border-collapse mb-1' >
                    <thead>
                        <tr>
                            <th className='border border-[#ccc] p-2 bg-[#f0f0f0]'  >#</th>
                            <th className='border border-[#ccc] p-2 bg-[#f0f0f0]' >Ouestion Name</th>
                            <th className='border border-[#ccc] p-2 bg-[#f0f0f0]' >Category</th>
                            {/* <th className='border border-[#ccc] p-2 bg-[#f0f0f0]' >Level</th> */}
                            <th className='border border-[#ccc] p-2 bg-[#f0f0f0]' >Question</th>
                            <th className='border border-[#ccc] p-2 bg-[#f0f0f0]' >Options</th>
                            <th className='border border-[#ccc] p-2 bg-[#f0f0f0]' >Answer</th>
                            <th className='border border-[#ccc] p-2 bg-[#f0f0f0]' >Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {item?.que.map((qu, inx) => (<tr key={inx}>
                            <td className='border border-[#ccc] p-2' >{qu?.question_number}</td>
                            <td className='border border-[#ccc] p-2'>{qu?.name}</td>
                            <td className='border border-[#ccc] p-2'>{qu?.category}</td>
                            {/* <td className='border border-[#ccc] p-2'>{qu?.type}</td> */}
                            <td className='border border-[#ccc] p-2'>{qu?.question}</td>

                            <td className='border border-[#ccc] p-2'>{qu.option.map((items, ins) => (<p key={ins} className="text-black text-xs font-normal">
                                {items.name}:{items.ans}
                            </p>))}</td>
                            <td className='border border-[#ccc] p-2'>{qu?.answer}</td>
                            <td className='border border-[#ccc] p-2'><img src={qu.image} className='h-10 w-10' /></td>
                        </tr>))}

                    </tbody>
                </table>
            </div>))}


        </div>
    )
}

export default isAuth(CreateTest)