/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import { IoList, IoCloseCircleOutline } from "react-icons/io5";
import { Context, userContext } from "@/pages/_app";
import { Api } from "../services/service";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import * as rdd from "react-device-detect";
import { MdDashboard, MdOutlineSubscriptions } from "react-icons/md";
import { FaUser } from "react-icons/fa6";
import { BiBookContent, BiSolidCategory } from "react-icons/bi";
import { FaQuestion } from "react-icons/fa6";
import { GrTest } from "react-icons/gr";
import { AiOutlineBell } from 'react-icons/ai'
import { MdOutlineContentPaste } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { IoMdTime } from "react-icons/io";

const menuItems = [
  {
    href: "/",
    title: "Dashboard",
    icon: <MdDashboard />,
    activeIcon: "/home.png",
    access: ["USER", "ORG", "ADMIN"],
  },
  {
    href: "/quizz-list",
    title: "Question Management",
    icon: <GrTest />,
    activeIcon: "/home.png",
    access: ["USER", "ORG", "ADMIN"],
  },
  // {
  //   href: "/study-management",
  //   title: "Study Management",
  //   icon: <GrTest />,
  //   activeIcon: "/home.png",
  //   access: ["USER", "ORG", "ADMIN"],
  // },
  {
    href: "/test-management",
    title: "Quiz Management",
    icon: <GrTest />,
    activeIcon: "/home.png",
    access: ["USER", "ORG", "ADMIN"],
  },
  {
    href: "/categories",
    title: "Category",
    icon: <BiSolidCategory />,
    activeIcon: "/home.png",
    access: ["USER", "ORG", "ADMIN"],
  },
  // {
  //   href: "/chapter-list",
  //   title: "Subject Management",
  //   icon: <GrTest />,
  //   activeIcon: "/home.png",
  //   access: ["USER", "ORG", "ADMIN"],
  // },
  // {
  //   href: "/subject",
  //   title: "Subjects",
  //   icon: <GrTest />,
  //   activeIcon: "/home.png",
  //   access: ["USER", "ORG", "ADMIN"],
  // },
  // {
  //   href: "/user-management",
  //   title: "User Management",
  //   icon: <FaUser />,
  //   activeIcon: "/home.png",
  //   access: ["USER", "ORG", "ADMIN"],
  // },
  // {
  //   href: "/faq",
  //   title: "FAQ",
  //   icon: <FaQuestion />,
  //   activeIcon: "/home.png",
  //   access: ["USER", "ORG", "ADMIN"],
  // },
  {
    href: "/subscription-management",
    title: "Subscription",
    icon: <MdOutlineSubscriptions />,
    activeIcon: "/home.png",
    access: ["USER", "ORG", "ADMIN"],
  },
  {
    href: "/notifications",
    title: "Notifications",
    icon: <AiOutlineBell />,
    activeIcon: "/home.png",
    access: ["USER", "ORG", "ADMIN"],
  },
  {
    href: "/time-slot",
    title: "Time Slot",
    icon: <IoMdTime />,
    activeIcon: "/home.png",
    access: ["USER", "ORG", "ADMIN"],
  },
  {
    href: "/settings",
    title: "Settings",
    icon: <IoSettings />,
    activeIcon: "/home.png",
    access: ["USER", "ORG", "ADMIN"],
  },
  {
    href: "/content-management",
    title: "Content Management",
    icon: <MdOutlineContentPaste />,
    activeIcon: "/home.png",
    access: ["USER", "ORG", "ADMIN"],
  },
];

const Layout = ({ children, loader, toaster }) => {
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [pageShow, setPageShow] = useState(false);
  const [orgList, setOrgList] = useState([]);
  const [userDetail, setUserDetail] = useState({});
  const [initial, setInitial] = useContext(Context);
  const [user, setUser] = useContext(userContext);
  const [userName, setUserName] = useState("ADMIN");
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [organizationOpen, setOrganizationOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOrganizationOpen(false);
  };

  useEffect(() => {
    setMobile(rdd.isMobile);
    if (rdd.isBrowser) {
      setToggleDrawer(true);
    }
    getUserDetail();
  }, [mobile]);

  const getUserDetail = () => {
    const user = localStorage.getItem("userDetail");
    if (!!user) {
      setUserDetail(JSON.parse(user));
      setUser(JSON.parse(user));
    } else {
      if (router.route !== "/" && router.route !== "/signup" && router.route !== "/privacy-policy" && router.route !== "/terms-conditions" && router.route !== "/about-us" && router.route !== "/contact-us") {
        router.push("/");
      }
    }
  };

  useEffect(() => {
    getusername();
    router.events.on("routeChangeComplete", () => { });
  }, [user, initial]);

  const getOrg = () => {
    loader(true);
    Api("get", "organizations", "", router).then(
      async (res) => {
        loader(false);
        // ;
        if (res?.status) {
          setOrgList(res.data.users);
        } else {
          toaster({ type: "success", message: res?.message });
        }
      },
      (err) => {
        loader(false);
        toaster({ type: "error", message: err.message });
        console.log(err);
      }
    );
  };

  const getusername = () => {
    setUserName(user.name);
    // if (user.type !== "ADMIN") {
    //   setUserName(user.username);
    // } else if (user.type === "ADMIN") {
    //   if (!!initial) {
    //     setUserName(initial.username);
    //   }
    // }
    // if (user.type === "ADMIN" && initial.username === undefined) {
    //   setUserName("ADMIN");
    // }

    console.log(userName, initial);
  };

  return (
    <div className="md:min-h-screen flex sm:flex-1 flex-col">
      {router.route !== "/login" && router.route !== "/signup" && router.route !== "/privacy-policy" && router.route !== "/terms-conditions" && router.route !== "/about-us" && router.route !== "/contact-us" && (
        <header
          className={`bg-[var(--custom-blue)] fixed top-0 w-full h-16 flex  font-semibold uppercase shadow-lg z-30 ${toggleDrawer && user?.id !== "6450e9bef4d2cc08c2ec0431"
            ? "ml-60"
            : "ml-0"
            }`}
        >
          <div className="flex justify-center items-center  ">
            {mobile && (
              <IoList
                className="text-white h-8 w-8 mx-5"
                onClick={() => {
                  setToggleDrawer(!toggleDrawer);
                }}
              />
            )}
            <div
              className={`flex-1  justify-center items-center ${toggleDrawer ? "hidden md:flex" : "flex"
                }`}
            >
              <div className="h-8 w-8 relative ml-0 md:ml-10  ">
                <img
                  // onClick={() => router.push("/profile")}
                  src={user?.profile || "/user-1.png"}
                  alt="icon"

                  className="rounded-full cursor-pointer"
                />
                {/* layout="fill" // required
                  objectFit="cover" */}
              </div>
              <h2 className="text-white text-base font-normal ml-2 normal-case">
                {userName}
                {/* Demomail.com */}
              </h2>
              {/* {!!user && user.type === "ADMIN" && (
                <div
                  className="ml-5 h-7 w-7 flex justify-center items-center bg-[var(--custom-blue)] rounded-md"
                  onClick={() => {
                    setOrganizationOpen(true);
                    getOrg();
                  }}
                >
                  <RiOrganizationChart className="text-white text-xl" />
                </div>
              )} */}
            </div>

            <div
              className={`flex-1  fixed right-5 justify-end ${toggleDrawer ? "hidden md:flex" : "flex"
                }`}
            >
              <div
                className="flex-1 flex justify-center item-center cursor-pointer"
                onClick={handleClickOpen}
              >
                {/* <div className="mx-2 border-r-2 border-[var(--custom-blue)] px-2">
                  <Image
                    src="/signout.png"
                    width="15"
                    height="15"
                    alt="icon"
                    layout="fixed"
                  ></Image>
                </div> */}
                {/* <p className="text-xs text-[var(--dark-orange)] font-semibold mt-0.5 capitalize ">
                  Sign out
                </p> */}
                <div className="flex justify-center items-center">
                  <h2 className="text-white text-base font-normal	 normal-case text-center pr-2">
                    {/* {userName} */}
                    {/* Demomail.com */}
                  </h2>
                  <img className="h-9 w-9" src="/logoutBtn.png" />
                </div>
                {/* <button className='text-[var(--custom-blue)] text-lg bg-white font-medium font-nunito w-28 h-10 rounded-[8px] ml-3'>Sign out</button> */}
              </div>
            </div>
          </div>
        </header>
      )}
      {router.route !== "/login" &&
        router.route !== "/signup" &&
        router.route !== "/privacy-policy" &&
        router.route !== "/terms-conditions" &&
        router.route !== "/about-us" &&
        router.route !== "/contact-us" &&
        toggleDrawer &&
        user?.id !== "6450e9bef4d2cc08c2ec0431" && (
          /*bg-stone-800*/
          <aside
            className={`bg-[var(--custom-blue)] w-60  fixed  min-h-screen z-40 `}
          // border-r-2 border-[var(--dark-lightBlue)]
          >
            {/* <div className="py-3 w-full justify-center text-center border-b-2 border-[var(--dark-lightBlue)]">
              <Image
                src="/logo.png"
                width="180"
                height="180"
                alt="icon"
                layout="fixed"
                className="my-2"
              ></Image>
            </div> */}
            <div className="p-4">
              <div className="w-52 h-52 bg-white rounded-full flex justify-center items-center border-b-2 border-white">
                {/* border-4  */}
                {/* <img src="/logo-1.png" className="rounded-md overflow-hidden w-40 h-40" /> */}
                <p className="text-[var(--custom-blue)] font-bold text-2xl">BRAINSPEED</p>

              </div>
            </div>

            <nav className="border-t-2 border-white">
              <ul>
                {menuItems.map((item) => (
                  <div key={item.title}>
                    {/* {item?.access?.includes(user?.usertype) && ( */}
                    <li
                      // className={`${router.route === item.href ? 'bg-[var(--dark-orange)]' : 'bg-[var(--custom-blue)]'} py-2  flex  px-5 border-b-2 border-white align-middle`}
                      className={`${router.route === item.href ? 'bg-white' : 'bg-[var(--custom-blue)]'} py-2  flex  px-5 border-b-2 border-white align-middle`}
                      onClick={() => {
                        router.push(item.href);
                        if (mobile) {
                          setToggleDrawer(!toggleDrawer);
                        }
                      }}
                    >
                      {/* className="justify-center align-middle" */}
                      <div className={`flex justify-center align-middle cursor-pointer text-base	${router.route === item.href ? 'text-[var(--custom-blue)]' : 'text-white'}`}>
                        {/* className={`flex justify-center align-middle cursor-pointer text-base	text-white`} */}
                        {/* hover:text-[var(--dark-orange)] 
                          ${router.asPath === item.href
                        ? "text-white"
                        : "text-[var(--custom-blue)]"
                        } */}
                        {item.icon}
                      </div>
                      {/* <div className="justify-center align-middle ">
                          <Image
                            src={
                              router.asPath === item.href
                                ? item.activeIcon
                                : item.icon
                            }
                            width="15"
                            height="15"
                            alt="icon"
                            layout="fixed"
                          ></Image>
                        </div> */}
                      <Link href={item.href}>
                        <p
                          className={`flex ml-2 font-normal cursor-pointer text-sm font-nunito ${router.route === item.href ? 'text-[var(--custom-blue)]' : 'text-white'}`}
                        >
                          {/* className={`flex ml-2 font-normal cursor-pointer text-sm font-nunito text-white`} */}

                          {/* hover:text-[var(--dark-orange)] 
                          ${router.asPath === item.href
                            ? "text-white"
                            : "text-[var(--custom-blue)]"
                            } */}
                          {item.title}
                        </p>
                      </Link>
                      {/* <div className="text-right flex-1 ">
                          <Image
                            src={
                              router.asPath === item.href
                                ? "/fwd-white.png"
                                : "/fwd-red.png"
                            }
                            width="8"
                            height="15"
                            alt="icon"
                            layout="fixed"
                          ></Image>
                        </div> */}
                    </li>
                    {/* )} */}
                  </div>
                ))}

              </ul>
            </nav>
          </aside>
        )}
      <div className={router.route !== "/privacy-policy" &&
        router.route !== "/terms-conditions" &&
        router.route !== "/about-us" &&
        router.route !== "/contact-us" ? "flex flex-col md:flex-row z-0 h-full  md:mt-0 mt-10" : "mt-0"}>
        <main
          className={
            router.route !== "/login" &&
              router.route !== "/signup" &&
              router.route !== "/privacy-policy" &&
              router.route !== "/terms-conditions" &&
              router.route !== "/about-us" &&
              router.route !== "/contact-us" &&
              toggleDrawer &&
              user?.id !== "6450e9bef4d2cc08c2ec0431"
              ? " md:pl-60 md:w-full  md:pt-16"
              : "flex-1"
          }
        >
          {/* {pageShow ? children : loader(true)} */}
          {children}
        </main>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          Alert
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Do you want to logout ?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              router.push("/login");
              localStorage.clear();
              setOpen(false);
              setUser({});
              setInitial({});
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={organizationOpen} onClose={handleClose}>
        <div className="px-5 pt-20 pb-5 border-2  border-[var(--custom-blue)] bg-black relative overflow-hidden w-80">
          <IoCloseCircleOutline
            className="text-[var(--custom-blue)] h-8 w-8 absolute right-2 top-2"
            onClick={handleClose}
          />
          <p className="text-white text-lg font-semibold">Organization</p>
          <select
            className="w-full bg-white text-white border-2 border-[var(--custom-blue)] rounded-md p-2 mt-2 outline-none"
            value={JSON.stringify(initial)}
            onChange={(text) => {
              // console.log(text.target.value);
              setInitial(JSON.parse(text.target.value));
              handleClose();
            }}
          >
            <option value={JSON.stringify({})}>Select</option>
            {orgList.map((item) => (
              <option value={JSON.stringify(item)} key={item._id}>
                {item.username}
              </option>
            ))}
          </select>
        </div>
      </Dialog>
    </div>
  );
};

export default Layout;
