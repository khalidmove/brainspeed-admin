/* eslint-disable @next/next/no-document-import-in-page */
/* eslint-disable @next/next/no-page-custom-font */
/* eslint-disable react-hooks/exhaustive-deps */
import "../styles/globals.css";
import Layout from "@/components/layouts";
import Loader from "@/components/loader";
import Toaster from "@/components/toaster";
import { useEffect, useState, createContext } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const Context = createContext();
export const userContext = createContext();
export const serviceContext = createContext();

function MyApp({ Component, pageProps }) {
  const [initial, setInitial] = useState({});
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({});
  const [pageURL, setPageURL] = useState("");
  const [isNativeShare, setNativeShare] = useState(false);
  const [serviceDetails, setServiceDetails] = useState({});
  const [toasts, setToast] = useState({
    type: "",
    message: "",
  });

  const router = useRouter();

  useEffect(() => {
    setOpen(open);
  }, [open]);



  useEffect(() => {
    setToast(toasts);
    if (!!toasts.message) {
      setTimeout(() => {
        setToast({ type: "", message: "" });
      }, 5000);
    }
  }, [toasts]);

  useEffect(() => {
    getUserDetail();
  }, []);

  const getUserDetail = () => {
    const user = localStorage.getItem("userDetail");
    console.log("drfdtftfyfgyhftgytgfygf", user);
    if (user) {
      setUser(JSON.parse(user));
      // if (JSON.parse(user)?.id === "6450e9bef4d2cc08c2ec0431") {
      //   router.push("/festaevent");
      // } else {
      // router.push("/");
      // }
    } else {
      if (router.route !== "/login" && router.route !== "/signup" && router.route !== "/privacy-policy" && router.route !== "/terms-conditions" && router.route !== "/about-us" && router.route !== "/contact-us") {
        router.push("/login");
      }
    }
  };



  return (
    <userContext.Provider value={[user, setUser]}>
      <Context.Provider value={[initial, setInitial]}>
        <serviceContext.Provider value={[serviceDetails, setServiceDetails]}>
          <ToastContainer />
          <Loader open={open} />

          {/* <div className="fixed right-5 top-20 min-w-max z-50">
            {!!toast.message && (
              <Toaster type={toast.type} message={toast.message} />
            )}
          </div> */}
          <Layout loader={setOpen} toaster={(t) => toast(t.message)}>
            <Loader open={open} />
            {/* <div className="fixed right-5 top-20 min-w-max">
              {!!toast.message && (
                <Toaster type={toast.type} message={toast.message} />
              )}
            </div> */}
            <Component
              {...pageProps}
              loader={setOpen}
              toaster={(t) => toast(t.message)}
              organization={initial}
              user={user}

            />
          </Layout>

        </serviceContext.Provider>
      </Context.Provider>
    </userContext.Provider>
  );
}

export default MyApp;
