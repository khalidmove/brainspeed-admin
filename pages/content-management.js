import React, { useState, useEffect, useContext } from 'react'
import dynamic from "next/dynamic";
import isAuth from '@/components/isAuth';
import { Api } from '@/services/service';
import { useRouter } from "next/router";
import moment from 'moment';
import { userContext } from './_app';
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

function ContentManagement(props) {
    const router = useRouter();
    const [user, setUser] = useContext(userContext);
    const [content, setContent] = useState({
        privacy: ''
    })
    const [terms, setTerms] = useState({
        termsAndConditions: ''
    })

    useEffect(() => {
        getContent()
        getPrivacy()
    }, []);

    const getContent = () => {
        props.loader(true);
        Api("get", 'content', router).then(
            (res) => {
                props.loader(false);
                console.log("res================>", res.data);
                if (res?.status) {
                    res.data[0].id = res.data[0]._id;
                    if (res.data.length > 0) {
                        setTerms({
                            termsAndConditions: res.data[0].termsAndConditions,
                            id: res.data[0]._id
                        })
                    }
                }
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    }

    const getPrivacy = () => {
        props.loader(true);
        Api("get", 'privacy', router).then(
            (res) => {
                props.loader(false);
                console.log("res================>", res.data);
                if (res?.status) {
                    res.data[0].id = res.data[0]._id;
                    if (res.data.length > 0) {
                        setContent({
                            privacy: res.data[0].privacy,
                            id: res.data[0]._id
                        })
                    }
                }
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    }

    const submit = () => {
        console.log(content)
        if (content && !content?.privacy) {
            props.toaster({ type: "error", message: "Privacy is required" });
            return
        }

        props.loader(true);
        Api("post", 'privacy', { ...content }, router).then(
            (res) => {
                console.log("res================>", res);
                props.loader(false);
                props.toaster({ type: "success", message: res.data.message });
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    }

    const termsSubmit = () => {
        console.log(terms)
        if (terms && !terms?.termsAndConditions) {
            props.toaster({ type: "error", message: "Terms And Conditions required" });
            return
        }

        props.loader(true);
        Api("post", 'content', { ...terms }, router).then(
            (res) => {
                console.log("res================>", res);
                props.loader(false);
                props.toaster({ type: "success", message: res.data.message });
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

            <div className='border-2 border-[var(--custom-blue)] rounded-[15px] mt-5 p-5'>
                <div>
                    <p className='text-black md:text-[26px] text-2xl font-medium'>Privacy Policies</p>
                    <div className='rounded-[11px] bg-[#C2D4FF] p-5 mt-2'>
                        <div className='rounded-[11px] bg-white p-5'>
                            <JoditEditor
                                className="editor max-h-screen overflow-auto"
                                //   ref={editor}
                                rows={5}
                                value={content?.privacy}
                                onChange={newContent => {
                                    setContent({
                                        ...content,
                                        privacy: newContent
                                    })
                                }}
                            />
                        </div>
                    </div>
                    <button className='bg-[var(--custom-blue)] h-[57px] w-[194px] rounded-[5px] text-white text-xl font-normal flex justify-center items-center mt-5' onClick={submit}>Update</button>
                </div>

                <div className='pt-5'>
                    <p className='text-black md:text-[26px] text-2xl font-medium'>Terms and Conditions</p>
                    <div className='rounded-[11px] bg-[#C2D4FF] p-5 mt-2'>
                        <div className='rounded-[11px] bg-white p-5'>
                            <JoditEditor
                                className="editor max-h-screen overflow-auto"
                                //   ref={editor}
                                rows={5}
                                value={terms?.termsAndConditions}
                                onChange={newContent => {
                                    setTerms({
                                        ...terms,
                                        termsAndConditions: newContent,
                                    });
                                }}
                            />
                        </div>
                    </div>
                    <button className='bg-[var(--custom-blue)] h-[57px] w-[194px] rounded-[5px] text-white text-xl font-normal flex justify-center items-center mt-5' onClick={termsSubmit}>Update</button>
                </div>
            </div>
        </div>
    )
}

export default isAuth(ContentManagement)