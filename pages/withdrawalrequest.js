import React, { useMemo, useState, useEffect, use } from "react";
import Table, { indexID } from "@/components/table";
import { Api, ApiForExcelReports } from "@/services/service";
import { useRouter } from "next/router";
import moment from "moment";
import isAuth from "@/components/isAuth";
import { Dialog, Drawer } from "@mui/material";
import { IoCloseCircleOutline } from "react-icons/io5";
import Swal from "sweetalert2";
import currencySign from "@/utils/currencySign";
import HistoryList from "@/components/historyList";
import { FaFileExcel } from "react-icons/fa";

function Withdralreq(props) {
  const router = useRouter();
  const [withdrawData, setWithdrawData] = useState([]);
  const [sellerid, setsellerid] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewPopup, setviewPopup] = useState(false);
  const [viewPopupData, setviewPopupData] = useState({});
  const [popupLimit, setpopupLimit] = useState(10);
  const [pageSize, setPageSize] = useState(10);
  const [amount, setAmount] = useState("");
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 10,
  });

  useEffect(() => {
    GetPendingWithdrawreq(currentPage);
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  useEffect(() => {
    GetPendingWithdrawreq(currentPage, pageSize);
  }, [pageSize]);

  const getClaimHistory = async (id, data) => {
    props.loader(true);
    Api(
      "get",
      `claim/getClaimRewardByUser/${id}?limit=${popupLimit}`,
      "",
      router
    ).then(
      (res) => {
        props.loader(false);
        console.log("res================>", res);
        setviewPopup(true);
        // setviewPopupData({
        //   ...viewPopupData,
        //   history: res?.data,
        // });
        console.log("viewPopupData", {
          ...viewPopupData,
          ...data,
          history: res?.data,
        });
        setviewPopupData({
          ...data,
          history: res?.data,
        });
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      }
    );
  };

  const GetPendingWithdrawreq = async (page = 1, limit = 10) => {
    props.loader(true);
    Api("get", `claim/getPendingClaimReward?page=${page}&limit=${limit}`, "", router).then(
      (res) => {
        props.loader(false);
        console.log("res================>", res);
        setWithdrawData(res?.data);
        setPagination(res?.pagination);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      }
    );
  };

  const handleExportCustomers = async (id) => {
      try {
        props.loader(true);
        props.toaster({ type: "info", message: "Preparing export... Please wait" });
        await ApiForExcelReports(`reports/exportClaimReport`);
       
        props.toaster({ type: "success", message: "Customer data exported successfully!" });
      } catch (error) {
        console.error('Export error:', error);
        props.toaster({ type: "error", message: error?.message })
      } finally {
        props.loader(false);
      }
    };
  
  const approvereq = (id, sellerid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to approve this payment ?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonText: "Approve",
      zindex: 9999,
    }).then(function (result) {
      console.log(result);
      if (result.isConfirmed) {
        const data = {
          id,
          // seller_id: sellerid,
          // amount: amount ? parseFloat(amount) : null,
        };
        props.loader(true);
        Api("post", `claim/updateClaimReward/${id}`, {}, router).then(
          (res) => {
            console.log("res================>", res.data?.message);
            props.loader(false);

            GetPendingWithdrawreq();
            setsellerid(null);
            setviewPopup(false);
            setviewPopupData({});
            setpopupLimit(10);
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
  
  // const createWithdrawreqByAdmin = (id, sellerid) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You want to approve this payment ?",
  //     icon: "warning",
  //     showCancelButton: true,
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Approve",
  //     zindex: 9999,
  //   }).then(function (result) {
  //     console.log(result);
  //     if (result.isConfirmed) {
  //       const data = {
  //         user_id: sellerid,
  //         amount: amount ? parseFloat(amount) : null,
  //       };
  //       props.loader(true);
  //       Api("post", `createWithdrawreqByAdmin`, data, router).then(
  //         (res) => {
  //           console.log("res================>", res.data?.meaasge);
  //           props.loader(false);

  //           GetPendingWithdrawreq();
  //           setsellerid(null);
  //           setviewPopup(false);
  //           setviewPopupData({});
  //           setpopupLimit(10);
  //           setAmount("");
  //           props.toaster({
  //             type: "success",
  //             message: res.data?.message || "Withdrawal request approved successfully",
  //           });
  //         },
  //         (err) => {
  //           props.loader(false);
  //           console.log(err);
  //           props.toaster({ type: "error", message: err?.data?.meaasge });
  //           props.toaster({ type: "error", message: err?.meaasge });
  //         }
  //       );
  //     } else if (result.isDenied) {
  //       // setFullUserDetail({})
  //     }
  //   });
  // };

  function indexID({ value }) {
    return (
      <div>
        <p className="text-custom-black text-base font-normal">
          {value}
        </p>
      </div>
    );
  }

  function name({ value }) {
    return (
      <div>
        <p className="text-custom-black text-base font-normal ">
          {value}
        </p>
      </div>
    );
  }
  function note({ value }) {
    return (
      <div>
        <p className="text-custom-black text-base font-normal  whitespace-normal">
          {value}
        </p>
      </div>
    );
  }

  function date({ value }) {
    return (
      <div>
        <p className="text-custom-black text-base font-normal ">
          {moment(value).format("DD MMM YYYY")}
        </p>
      </div>
    );
  }

  function mobile({ value }) {
    return (
      <div>
        <p className="text-custom-black text-base font-normal ">
          {value}
        </p>
      </div>
    );
  }

  function status({ value }) {
    return (
      <div>
        <p
          className={`text-custom-black text-base font-normal  
                     ${value == "Verified" ? "text-green-500" : ""}
                     ${value == "Suspend" ? "text-red-500" : ""}
                     ${value == "Pending" ? "text-yellow-500" : ""}
                     `}
        >
          {value}
        </p>
      </div>
    );
  }

  const info = ({ value, row }) => {
    // console.log(row.original)
    return (
      <div className="flex gap-2 items-center ">
        <button
          className="h-[38px] w-[93px] bg-[var(--custom-blue)] text-white text-base	font-normal rounded-[8px]"
          onClick={() => {
            getClaimHistory(row.original.req_user._id, row.original);
            // setviewPopupData((prev) => ({
            //   ...prev,
            //   ...row.original,
            // }));
            // setviewPopup(true);
            // // setviewPopupData(row.original);
            // console.log(row.original);
          }}
        >
          View
        </button>
        <button
          className="h-[38px] w-[93px] bg-green-500 text-white text-base	font-normal rounded-[8px]"
          onClick={() => {
            // setviewPopup(true)
            // console.log(row.original)
            approvereq(row.original._id, row.original.req_user._id);
          }}
        >
          Approve
        </button>
      </div>
    );
  };

  const columns = useMemo(
    () => [
      {
        Header: "No.",
        accessor: (row, i) => i + 1,
        Cell: indexID,
      },
      {
        Header: "Name",
        accessor: "req_user.name",
        Cell: name,
      },
      {
        Header: "Mobile",
        accessor: "req_user.phone",
        Cell: mobile,
      },
      {
        Header: "Email",
        accessor: "req_user.email",
        Cell: mobile,
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: status,
      },
      // {
      //   Header: "Note",
      //   accessor: "note",
      //   Cell: note,
      // },
      {
        Header: "Amount",
        accessor: "points",
        Cell: mobile,
      },
      {
        Header: "Info",
        // accessor: "view",
        accessor: (row) => row,
        Cell: info,
      },
    ],
    []
  );

  return (
    <section className=" w-full h-full bg-transparent pt-1 pb-5 pl-5 pr-5">
      <p className="text-custom-black font-bold md:text-[32px] text-2xl">
        Points Withdrawal Request
      </p>
      {/* pl-2  */}
      {viewPopup && (
        <Dialog
          open={viewPopup}
          onClose={() => {
            setviewPopup(false);
            setviewPopupData({});
            setpopupLimit(2);
          }}
          //  maxWidth="md"
          fullScreen
        >
          <div className="p-5  bg-white relative overflow-y-auto">
            <IoCloseCircleOutline
              className="text-black h-8 w-8 absolute right-2 top-2"
              onClick={() => {
                setviewPopup(false);
                setviewPopupData({});
                setpopupLimit(2);
              }}
            />
            <div className="md:flex justify-between border-b-2 border-b-gray-300 py-2">
              <div className="">
                <div className="md:flex flex-row justify-start items-start">
                  <div className="flex flex-col justify-start items-start md:pl-5">
                    <p className="text-base font-bold text-custom-black md:pt-0 pt-2">
                      {viewPopupData?.req_user?.name}
                    </p>
                    <p className="text-sm font-semibold text-custom-black pt-2">
                      {viewPopupData?.req_user?.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-6 flex md:justify-center justify-start items-center min-w-[400px] md:border-l-2 md:border-l-gray-300 ">
                <div className="grid grid-cols-4 gap-x-4 w-full justify-between items-center md:pl-5">
                  <div className="col-span-2 flex gap-2 justify-start items-center w-full">
                    <p className="text-sm font-semibold text-gray-600">
                      Withdrawal Date:
                    </p>
                    <p className="text-sm font-normal text-custom-black">
                      {viewPopupData?.createdAt
                        ? moment(viewPopupData?.createdAt).format("DD MMM YYYY")
                        : "N/A"}
                    </p>
                  </div>
                  <div className="col-span-2 flex gap-2 justify-start items-center w-full">
                    <p className="text-sm font-semibold text-gray-600">
                      Withdrawal Amount:
                    </p>
                    <p className="text-sm font-normal text-custom-black">
                      {currencySign(viewPopupData?.amount?.toFixed(2))}
                    </p>
                  </div>
                  <div className="col-span-2 flex gap-2 justify-start items-center w-full">
                    <p className="text-sm font-semibold text-gray-600">
                      Wallet Balance:
                    </p>
                    <p className="text-sm font-normal text-custom-black">
                      {currencySign(
                        viewPopupData?.req_user?.points?.toFixed(2)
                      )}
                    </p>
                  </div>
                  {/* <div className="col-span-2 flex gap-2 justify-start items-center w-full">
                    <p className="text-sm font-semibold text-gray-600">
                      Wallet Balance:
                    </p>
                    <p className="text-sm font-normal text-custom-black">
                      {currencySign(viewPopupData?.wallet?.toFixed(2))}
                    </p>
                  </div> */}
                </div>
              </div>

              {/* <div className="flex md:justify-center justify-start items-center min-w-[400px] md:border-l-2 md:border-l-gray-300 ">
                <div className="flex flex-col justify-start items-start md:pl-5">
                  <div className="flex gap-5 justify-between items-center w-full md:pt-0 pt-2">
                    <div>
                    <input
                      className="bg-transparent md:h-[40px] h-[40px] w-[180px] px-5 border border-custom-newGray rounded-[10px] outline-none text-custom-darkGrayColor text-base font-light"
                      type="tel"
                      placeholder="Send Amount"
                      value={amount}
                      onChange={(e) => {
                        const inputValue = e.target.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                        const numericValue = parseInt(inputValue || "0", 10);
                        const maxAllowed = viewPopupData?.request_by?.wallet
                          ? Math.floor(viewPopupData?.request_by?.wallet / 2)
                          : 0;

                        if (numericValue > maxAllowed) {
                          props.toaster({
                            type: "error",
                            message: `You can enter up to 50% of seller wallet balance only (${currencySign(
                              maxAllowed
                            )})`,
                          });
                          return;
                        }

                        setAmount(numericValue.toString());
                      }}
                      required
                    />
                    <p className="text-custom-darkGray text-xs font-normal pt-1">
                    Allowed up to (
                    {currencySign(
                      typeof viewPopupData?.request_by?.wallet === "number"
                        ? Math.floor(viewPopupData?.request_by?.wallet / 2).toFixed(2)
                        : "0.00"
                    )}
                    )
                  </p>
                  </div>
                    <button
                      className="h-[38px] w-[93px] bg-green-500 text-white text-base	font-normal rounded-[8px] md:mb-5"
                      onClick={() => {
                        // setviewPopup(true)
                        // console.log(row.original)
                        createWithdrawreqByAdmin(
                          viewPopupData?._id,
                          viewPopupData?.request_by?._id
                        );
                      }}
                    >
                      Approve
                    </button>
                  </div>
                  <div className="flex justify-between items-center w-full pt-2">
                  </div>
                </div>
              </div> */}
            </div>
            <p className="text-custom-black text-base font-bold pt-4">
              Withdrawal Request Amount:{" "}
              <span className="text-custom-darkGrayColor">
                {currencySign(viewPopupData?.points?.toFixed(2))}
              </span>
            </p>
            <div className="mt-5 w-full">
              {viewPopupData?.history?.map((item, index) => (
                <HistoryList {...props} data={item} key={index} />
              ))}

              <button
                className="h-[38px] w-[110px] bg-custom-darkpurple text-white text-base	font-normal rounded-[8px] mt-5 justify-center items-center mx-auto block"
                onClick={() => {
                  setpopupLimit(popupLimit + 10);
                  getClaimHistory(
                    viewPopupData?.req_user?._id,
                    viewPopupData
                  );
                }}
              >
                Load More
              </button>
            </div>
          </div>
        </Dialog>
      )}
      <section className="px-5 pt-1 md:pb-32 pb-28 bg-white h-full rounded-[12px] overflow-auto mt-3">
        <div className='bg-[var(--custom-blue)] h-[47px] w-[154px] rounded-[5px] text-white text-base font-normal flex justify-center items-center mt-5 gap-2 absolute' onClick={() => handleExportCustomers()}>
                              <div >Download Excel</div>
                          <FaFileExcel className='h-4 w-4 text-white' />
                          </div>
        <div className="">
          <Table
            columns={columns}
            data={withdrawData}
            pagination={pagination}
            onPageChange={(page) => setCurrentPage(page)}
            currentPage={currentPage}
            itemsPerPage={pagination.itemsPerPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
          />
        </div>
      </section>
    </section>
  );
}

export default isAuth(Withdralreq);
