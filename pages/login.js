import Image from "next/image";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import { MdArrowForward, MdEmail, MdPassword } from "react-icons/md";
import { useContext, useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { checkForEmptyKeys } from "@/services/InputsNullChecker";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { userContext } from "./_app";

export default function Home(props) {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userDetail, setUserDetail] = useState({
    email: "",
    password: "",
  });
  const [user, setUser] = useContext(userContext);

  const submit = () => {
    // let { anyEmptyInputs } = checkForEmptyKeys(userDetail);
    if (userDetail.email === '' || userDetail.password === '') {
      setSubmitted(true);
      return;
    }
    props.loader(true);
    const data = {
      email: userDetail.email.toLowerCase(),
      password: userDetail.password,
    };
    Api("post", "auth/login", data, router).then(
      (res) => {
        console.log("res================>", res);
        props.loader(false);

        if (res?.status) {
          localStorage.setItem("userDetail", JSON.stringify(res.data.user));
          localStorage.setItem("token", res.data.token);

          setUser(res.data.user);

          router.push("/");

          setUserDetail({
            email: "",
            password: "",
          });
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
    <div className="flex min-h-screen bg-white justify-center items-center">
      <div className="border-2 rounded-3xl border-[var(--dark-orange)] md:p-10 p-5 sm:w-1.5 md:w-1/3  ">
        <p className="text-black text-center md:text-4xl text-2xl font-semibold mb-10">
          Welcome
        </p>
        <div className="flex bg-white py-2 mt-4 rounded-md border  border-black md:h-14 sm:h-10 w-64 md:min-w-full ">
          <div className="flex md:mx-4 mx-2.5 justify-center md:h-10 sm:h-8 items-center ">
            <div className="md:w-5 md:h-5 w-4 h-4 relative">
              <MdEmail className="text-xl text-[var(--dark-orange)]" />
            </div>
          </div>
          <input
            placeholder="User Name"
            className="bg-white outline-none pl-2 text-black text-xs md:text-base border-l-2 border-black md:h-10 h-5"
            value={userDetail.email}
            autoComplete="false"
            onChange={(text) => {
              setUserDetail({ ...userDetail, email: text.target.value });
            }}
          />
        </div>
        {submitted && userDetail.email === "" && (
          <p className="text-red-700 mt-1">Email is required</p>
        )}
        {/* {submitted &&
          !checkEmail(userDetail.email) &&
          userDetail.email !== "" && (
            <p className="text-red-700 mt-1">Email is invalid</p>
          )} */}
        <div className="flex bg-white py-2 mt-4 rounded-md  border  border-black md:h-14 sm:h-10 min-w-full relative items-center w-64 md:min-w-full ">
          <div className="flex md:mx-4 mx-2.5  justify-center md:h-10 sm:h-8 items-center ">
            <div className="md:w-5 md:h-5 w-4 h-4 relative">
              <MdPassword className="text-xl text-[var(--dark-orange)]" />
            </div>
          </div>
          <input
            placeholder="Password"
            type={showPass ? "text" : "password"}
            className="bg-white outline-none pl-2 text-black text-xs md:text-base border-l-2 border-black md:h-10 h-5"
            value={userDetail.password}
            autoComplete="new-password"
            onChange={(text) => {
              setUserDetail({ ...userDetail, password: text.target.value });
            }}
          />
          <div
            className="absolute right-3 "
            onClick={() => setShowPass(!showPass)}
          >
            <div className="md:w-5 md:h-3.5 w-3.5 h-2.5 relative">
              {showPass ? (
                <AiFillEye className="text-xl text-[var(--dark-orange)]" />
              ) : (
                <AiFillEyeInvisible className="text-xl text-[var(--dark-orange)]" />
              )}
            </div>
          </div>
        </div>
        {submitted && userDetail.password === "" && (
          <p className="text-red-700 mt-1">Password is required</p>
        )}

        <div className=" mt-10 grid grid-cols-2 gap-8">
          <div className="items-start">
            <p className="text-black text-left md:text-4xl text-2xl font-semibold ">
              Sign in
            </p>
          </div>
          <div className="flex justify-end" onClick={submit}>
            <div className="md:w-10 md:h-10 w-8 h-8 relative bg-[var(--dark-orange)] rounded-full flex justify-center items-center">
              <MdArrowForward className="text-white w-5 h-5" />
            </div>
          </div>
        </div>

        {/* <div className="flex justify-between items-center mt-5">
          <p className="text-black text-base font-semibold cursor-pointer" onClick={() => router.push("/privacy-policy")}>Privacy policy</p>
          <p className="text-black text-base font-semibold cursor-pointer" onClick={() => router.push("/terms-conditions")}>Terms and conditions</p>
        </div>

        <div className="flex justify-between items-center mt-5">
          <p className="text-black text-base font-semibold cursor-pointer" onClick={() => router.push("/about-us")}>About us</p>
          <p className="text-black text-base font-semibold cursor-pointer" onClick={() => router.push("/contact-us")}>Contact us</p>
        </div> */}

        <div className="grid grid-cols-2 w-full gap-2 mt-5">
          <p className="text-black md:text-base text-sm font-semibold cursor-pointer" onClick={() => router.push("/privacy-policy")}>Privacy policy</p>
          <p className="text-black md:text-base text-sm font-semibold cursor-pointer" onClick={() => router.push("/terms-conditions")}>Terms and conditions</p>
          <p className="text-black md:text-base text-sm font-semibold cursor-pointer" onClick={() => router.push("/about-us")}>About us</p>
          <p className="text-black md:text-base text-sm font-semibold cursor-pointer" onClick={() => router.push("/contact-us")}>Contact us</p>
        </div>

      </div>
    </div>
  );
}
