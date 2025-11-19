import React, { useState, useRef, useEffect, useContext } from 'react'
import { useRouter } from "next/router";
import { IoCloseCircleOutline } from "react-icons/io5";
import { Api, ApiFormData } from '@/services/service';
import isAuth from '@/components/isAuth';
import { MdAdd, MdCloudUpload } from 'react-icons/md';
import { FiImage } from 'react-icons/fi';
import moment from 'moment';
import { userContext } from './_app';

function Settings(props) {
    const router = useRouter();
    const [submitted, setSubmitted] = useState(false);
    const f = useRef(null);
    const [carouselImg, setCarouselImg] = useState([]);
    const [singleImg, setSingleImg] = useState('');
    const [settingsId, setSettingsId] = useState('');
    const [QuizTime, setQuizTime] = useState("");
    const [user, setUser] = useContext(userContext);

    useEffect(() => {
        getsetting()
    }, [])

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const data = new FormData()
        data.append('file', file)
        props.loader(true);
        ApiFormData("post", "auth/fileupload", data, router).then(
            (res) => {
                props.loader(false);
                console.log("res================>", res);
                if (res.status) {
                    setSingleImg(res.data.file)
                    props.toaster({ type: "success", message: res.data.message });
                }
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
        const reader = new FileReader();
    };

    const submit = (e) => {
        e.preventDefault();
        console.log(carouselImg);
        props.loader(true);
        let data = {
            carousel: carouselImg,
        };
        if (settingsId) {
            data.id = settingsId
        }
        console.log(data);
        props.loader(true);
        Api("post", `${settingsId ? `setting/updatesetting` : `setting/createsetting`}`, data, router).then(
            (res) => {
                console.log("res================>", res);
                props.loader(false);

                if (res?.success) {
                    getsetting()
                    setSubmitted(false);
                    props.toaster({ type: "success", message: res?.message });
                } else {
                    props.loader(false);
                    console.log(res?.data?.message);
                    props.toaster({ type: "error", message: res?.data?.message });
                }
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.data?.message });
                props.toaster({ type: "error", message: err?.message });
            }
        );
    };

    const getsetting = async () => {
        props.loader(true);
        Api("get", 'setting/getsetting', '', router).then(
            (res) => {
                props.loader(false);
                console.log("res================>", res);
                if (res?.success) {
                    if (res?.setting.length > 0) {
                        setSettingsId(res?.setting[0]._id)
                        setCarouselImg(res?.setting[0].carousel)
                        setQuizTime(res?.setting[0].quiztime);
                    }
                } else {
                    props.loader(false);
                    console.log(res?.data?.message);
                    props.toaster({ type: "error", message: res?.data?.message });
                }
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    }

    const closeIcon = (item) => {
        const d = carouselImg.filter((f) => f !== item);
        setCarouselImg(d)
    }
const createQuizTime = (e) => {
    e.preventDefault();

    props.loader(true);
    let data = {
      id: settingsId,
      quiztime: Number(QuizTime),
    };
    console.log(data);
    props.loader(true);
    Api("post", `setting/updatesetting`, data, router).then(
      (res) => {
        props.loader(false);
        console.log("res================>", res.status);

        if (res?.status === true) {
          console.log(res?.data?.message);
          props.toaster({ type: "success", message: "Quiz time updated succesfully." });
        } else {
          console.log(res?.data?.message);
          props.toaster({ type: "error", message: res?.data?.message });
        }
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.data?.message });
        props.toaster({ type: "error", message: err?.message });
      }
    );
  };
    return (
        <>
            <div className="bg-white min-h-full md:pt-10 pt-11 md:pb-10 pb-5 px-5">
                <div className='border-2 rounded-[15px] border-[var(--dark-blue)] p-5'>
                    <div className='md:flex justify-between'>
                        <div>
                            <p className='text-2xl font-bold text-black MerriweatherSans'>{`${moment(new Date()).format('DD-MMM-YYYY')} , ${moment(new Date()).format('dddd')}`}</p>
                            <p className='md:text-4xl text-3xl font-bold text-black MerriweatherSans pt-2'>Hello <span className='text-[var(--dark-orange)]'>{user?.name}</span></p>
                        </div>
                    </div>
                </div>

                <section className="w-full h-full mt-5">
                    <form className="w-full" onSubmit={submit}>

                        <div className="">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="p-2 bg-[#00000010] rounded-lg">
                                    <FiImage className="h-5 w-5 text-black" />
                                </div>
                                <h2 className="text-gray-800 text-xl font-bold">Carousel Images</h2>
                            </div>

                            <div className="relative">
                                <div className="relative">
                                    <input
                                        className="w-full h-14 px-6 pr-16 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none text-gray-800 font-medium placeholder-gray-500 focus:border-blue-600 focus:bg-white transition-all duration-200"
                                        type="text"
                                        placeholder="Carousel Images"
                                        value={singleImg}
                                        onChange={(text) => {
                                            setSingleImg(text.target.value)
                                        }}
                                    />
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                        <button
                                            type="button"
                                            className="p-2 bg-[var(--custom-blue)] rounded-lg transition-colors duration-200"
                                            onClick={() => {
                                                f.current.click();
                                            }}
                                        >
                                            <MdCloudUpload className="text-white h-5 w-5" />
                                        </button>
                                        <input
                                            type="file"
                                            ref={f}
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                </div>

                                {submitted && carouselImg.carousel_image === "" && (
                                    <p className="text-red-500 mt-2 text-sm font-medium flex items-center">
                                        <span className="w-4 h-4 bg-red-500 rounded-full mr-2 flex-shrink-0"></span>
                                        Carousel image is required
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end mt-4">
                                <button
                                    type="button"
                                    className="flex items-center space-x-2 px-6 py-2 bg-[var(--custom-blue)] text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                                    onClick={() => {
                                        if (singleImg === "") {
                                            props.toaster({ type: "error", message: "Carousel Images is required" });
                                            return
                                        }
                                        setCarouselImg([...carouselImg, { image: singleImg }]);
                                        setSingleImg('');
                                    }}
                                >
                                    <MdAdd className="h-5 w-5" />
                                    <span>Add Image</span>
                                </button>
                            </div>

                            {carouselImg.length > 0 && (
                                <div className="bg-gray-50 rounded-xl p-6 mt-6">
                                    <h3 className="text-gray-700 font-semibold mb-4 flex items-center">
                                        <FiImage className="mr-2" />
                                        Added Images ({carouselImg.length})
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {carouselImg?.map((item, i) => (
                                            <div className="relative group" key={i}>
                                                <div className="relative overflow-hidden rounded-lg bg-white shadow-sm hover:border-blue-300 transition-all duration-200">
                                                    <img
                                                        className="w-full h-24 object-contain "
                                                        src={item?.image}
                                                        alt={`Carousel ${i + 1}`}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute top-2 -right-0.5 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                                                        onClick={() => { closeIcon(item) }}
                                                    >
                                                        <IoCloseCircleOutline className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-6">
                            {/* border-t border-gray-200 */}
                            <button
                                type="submit"
                                className="px-8 py-2 bg-[var(--custom-blue)] text-white font-bold rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </section>
       <section className="px-5 pt-5 pb-5 bg-white rounded-[12px] overflow-scroll md:mt-5 mt-5 no-scrollbar">
          {/* md:mt-9 */}
          <form className="w-full flex flex-row gap-5" onSubmit={createQuizTime}>
            <div className="w-full relative ">
              <p className="text-custom-gray text-lg font-semibold my-2">
                Quiz Time (in secends)
              </p>
              <div className="border border-gray-400 rounded-md p-2 w-full bg-custom-light flex justify-start items-center">
                <input
                  className="outline-none bg-custom-light md:w-[90%] w-[85%] text-black"
                  type="number"
                  required
                  max="60"
                  placeholder={"Enter Quiz Time"}
                  value={QuizTime}
                  onChange={(text) => {
                    const regex = /^[0-9]*\.?[0-9]*$/;
                    if (regex.test(text.target.value)) {
                      setQuizTime(text.target.value);
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end items-end mt-5">
              <button
                type="submit"
                className="text-white bg-[var(--custom-blue)] rounded-[10px] text-center  text-md py-2 w-36 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update
              </button>
            </div>
          </form>
        </section>

            </div>
        </>
    )
}

export default isAuth(Settings)
