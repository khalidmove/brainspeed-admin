import React, { useContext, useEffect, useState } from 'react'
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import moment from 'moment';
import { userContext } from './_app';
import { Api } from '@/services/service';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });
function ContentManagement(props) {
  const router = useRouter();
  const [terms, setTerms] = useState({
    termsAndConditions: '',
    privacy: '',
    about_us: '',
    contact_us: '',
  })
  const [user, setUser] = useContext(userContext)

  useEffect(() => {
    getContent()
  }, [])

  const getContent = () => {
    props.loader(true);
    Api("get", "content/getContent", router).then(
      (res) => {
        console.log("res================>", res.data?.incident);
        props.loader(false);

        if (res?.status) {
          setTerms({ ...res?.data, id: res?.data?._id })
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

  const termsSubmit = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't to update this contents",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!"
    }).then((result) => {
      if (result.isConfirmed) {
        props.loader(true);
        Api("post", "content/createContent", terms, router).then(
          (res) => {
            console.log("res================>", res.data.incident);
            props.loader(false);
            if (res?.status) {
              getContent()
              props.toaster({ type: "success", message: res?.data?.message })
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
      }
    });
  }

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

      <div className='h-full overflow-auto'>
        {/* md:pb-32 pb-28 md:mt-9 mt-5 */}

        <div className='w-full'>
          <div className='w-full'>
            <div className="md:grid grid-cols-2 bg-[#00000020] md:px-5 p-4 rounded-xl border-t-8 mt-5 border-black">
              <div className='md:mb-0 mb-0'>
                <p className="text-black font-bold md:text-3xl text-lg">
                  Terms and Condition
                </p>
              </div>
            </div>

            <section className='pb-4 relative'>
              <div className='w-[99%] mx-auto md:w-full bg-white h-full border-[3px] border-black rounded-lg p-3 md:p-8 flex flex-col overflow-auto space-y-4'>

                <div className='w-full  text-sm md:text-md rounded-2xl  space-y-4 border-t-[10px] border-black text-black'>
                  <JoditEditor
                    className="editor max-h-screen overflow-auto"
                    rows={8}
                    value={terms?.termsAndConditions}
                    onChange={newContent => {
                      setTerms({
                        ...terms,
                        termsAndConditions: newContent,
                      });
                    }}
                  />
                </div>
                <div className="flex gap-10 items-center justify-center md:justify-start">
                  <button className="text-lg text-white font-semibold  bg-black rounded-lg md:py-2 py-1 px-2 md:px-8" onClick={termsSubmit}>Update</button>
                </div>
              </div>
            </section>
          </div>

          <div className='w-full'>
            <div className="md:grid grid-cols-2 bg-[#00000020] md:px-5 p-4 rounded-xl border-t-8 border-black">
              <div className='md:mb-0 mb-0'>
                <p className="text-black font-bold md:text-3xl text-lg">
                  Privacy Policy
                </p>
              </div>
            </div>

            <section className='pb-4 relative'>
              <div className='w-[99%] mx-auto md:w-full bg-white h-full border-[3px] border-black rounded-lg p-3 md:p-8 flex flex-col overflow-auto space-y-4'>
                <div className='w-full  text-sm md:text-md rounded-2xl  space-y-4 border-t-[10px] border-black text-black'>
                  <JoditEditor
                    className="editor max-h-screen overflow-auto"
                    rows={8}
                    value={terms.privacy}
                    onChange={newContent => {
                      setTerms({
                        ...terms,
                        privacy: newContent
                      });
                    }}
                  />
                </div>
                <div className="flex gap-10 items-center justify-center md:justify-start">
                  <button className="text-lg text-white font-semibold  bg-black rounded-lg md:py-2 py-1 px-2 md:px-8" onClick={termsSubmit}>Update</button>
                </div>
              </div>
            </section>
          </div>

          <div className='w-full'>
            <div className="md:grid grid-cols-2 bg-[#00000020] md:px-5 p-4 rounded-xl border-t-8 border-black">
              <div className='md:mb-0 mb-0'>
                <p className="text-black font-bold md:text-3xl text-lg">
                  About us
                </p>
              </div>
            </div>

            <section className='pb-4 relative'>
              <div className='w-[99%] mx-auto md:w-full bg-white h-full border-[3px] border-black rounded-lg p-3 md:p-8 flex flex-col overflow-auto space-y-4'>
                <div className='w-full  text-sm md:text-md rounded-2xl  space-y-4 border-t-[10px] border-black text-black'>
                  <JoditEditor
                    className="editor max-h-screen overflow-auto"
                    rows={8}
                    value={terms.about_us}
                    onChange={newContent => {
                      setTerms({
                        ...terms,
                        about_us: newContent
                      });
                    }}
                  />
                </div>
                <div className="flex gap-10 items-center justify-center md:justify-start">
                  <button className="text-lg text-white font-semibold  bg-black rounded-lg md:py-2 py-1 px-2 md:px-8" onClick={termsSubmit}>Update</button>
                </div>
              </div>
            </section>
          </div>

          <div className='w-full'>
            <div className="md:grid grid-cols-2 bg-[#00000020] md:px-5 p-4 rounded-xl border-t-8 border-black">
              <div className='md:mb-0 mb-0'>
                <p className="text-black font-bold md:text-3xl text-lg">
                  Contact us
                </p>
              </div>
            </div>

            <section className='relative'>
              <div className='w-[99%] mx-auto md:w-full bg-white h-full border-[3px] border-black rounded-lg p-3 md:p-8 flex flex-col overflow-auto space-y-4'>
                <div className='w-full  text-sm md:text-md rounded-2xl  space-y-4 border-t-[10px] border-black text-black'>
                  <JoditEditor
                    className="editor max-h-screen overflow-auto"
                    rows={8}
                    value={terms.contact_us}
                    onChange={newContent => {
                      setTerms({
                        ...terms,
                        contact_us: newContent
                      });
                    }}
                  />
                </div>
                <div className="flex gap-10 items-center justify-center md:justify-start">
                  <button className="text-lg text-white font-semibold  bg-black rounded-lg md:py-2 py-1 px-2 md:px-8" onClick={termsSubmit}>Update</button>
                </div>
              </div>
            </section>
          </div>
        </div>

      </div>

      {/* </section> */}

    </div>
  );
}

export default ContentManagement