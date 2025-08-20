import React, { useState, useEffect, useMemo, useContext } from "react";
import * as XLSX from "xlsx";
import Table from "@/components/table";
import { userContext } from "./_app";
import { Api, ApiFormData } from "@/services/service";
import { useRouter } from "next/router";
// import currencySign from "@/utils/currencySign";
import copy from "copy-to-clipboard";

function UploadProductFromFile(props) {
    const [file, setFile] = useState(null);
    const [jenretteFile, setJenretteFile] = useState(null);
    const [jenretteFileData, setJenretteFileData] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: 10,
    });
    const router = useRouter();

    const [uploadedData, setUploadedData] = useState([]);
    const [data, setData] = useState([]);
    const [user] = useContext(userContext);

    const handleFileUpload = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    // const handleJenretteFileUpload = (event) => {
    //     const selectedJenretteFile = event.target.files[0];
    //     if (selectedJenretteFile) {
    //         setJenretteFile(selectedJenretteFile);
    //     }
    // }

    useEffect(() => {
        // getProduct();
    }, []);

    const getProduct = async () => {
        props.loader(true);
        Api("get", "getProduct", router).then(
            (res) => {
                props.loader(false);
                setData(res.data);
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    };

    const handleSubmit = () => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const binaryStr = e.target.result;
                const workbook = XLSX.read(binaryStr, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                let parsedData = XLSX.utils.sheet_to_json(sheet);
                console.log(parsedData);
                // Clean keys
                // parsedData = parsedData.map((row) => {
                //     const cleanedRow = {};
                //     Object.keys(row).forEach((key) => {
                //         const cleanedKey = key.trim();
                //         cleanedRow[cleanedKey] = row[key];
                //     });
                //     return cleanedRow;
                // });

                // Transform & filter
                parsedData = parsedData
                    .map((row) => {
                        return {
                            question_number: row['Question number'],
                            name: row['Question name'].trim(),
                            category: row.Category.trim() || "",
                            image: row.Photo.trim() || "",
                            type: row.Level.trim() || "",
                            question: row.Question.trim() || "",
                            option:
                                [
                                    {
                                        name: 'A',
                                        ans: row['Option-A'].trim()
                                    },
                                    {
                                        name: 'B',
                                        ans: row['Option-B'].trim()
                                    },
                                    {
                                        name: 'C',
                                        ans: row['Option-C'].trim()
                                    },
                                    {
                                        name: 'D',
                                        ans: row['Option-D'].trim()
                                    }
                                ],

                            answer: row['Correct Answer'].trim(),

                        };
                    })
                    .filter(Boolean); // Removes null entries

                setUploadedData(parsedData);
                setPagination((prev) => ({
                    ...prev,
                    totalPages: Math.ceil(parsedData.length / prev.itemsPerPage),
                }));

                console.log(parsedData);
            };
            reader.readAsBinaryString(file);
        } else {
            console.error("No file selected");
        }
    };

    const handleJenretteFileUploaded = (event, i) => {
        // const file = event.target.files[0];
        const selectedJenretteFile = event.target.files[0];
        if (selectedJenretteFile) {
            setJenretteFile(selectedJenretteFile);
        }
        const data = new FormData()
        data.append('file', jenretteFile)
        props.loader(true);
        ApiFormData("post", "auth/fileupload", data, router).then(
            (res) => {
                props.loader(false);
                console.log("res================>", res);
                if (res.status) {
                    setJenretteFileData(res?.data?.file);
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

    const handleCopy = () => {
        console.log('sbdbdsds')
        copy(jenretteFileData);
        // alert("Text copied to clipboard!");
    };

    const uploadData = async () => {
        props.loader(true);
        Api("post", "question/createmany", uploadedData, router).then(
            (res) => {
                props.loader(false);
                console.log("res================>", res.data);
                if (res.status) {
                    props.toaster({
                        type: "success",
                        message: "Item updated successfully",
                    });
                    setUploadedData([]);
                    setFile(null);
                    router.push("/quizz-list");
                } else {
                    props.toaster({ type: "error", message: res?.data?.message });
                }
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    };

    const columns = useMemo(
        () => [
            {
                Header: "Ouestion Number",
                accessor: "question_number",
                Cell: ({ value }) => (
                    <div className="p-4 flex flex-col items-center justify-center">
                        <p className="text-black text-base font-normal">{value}</p>
                    </div>
                ),
            },
            {
                Header: "Ouestion Name",
                accessor: "name",
                Cell: ({ value }) => (
                    <div className="p-4 flex flex-col items-center justify-center">
                        <p className="text-black text-base font-normal">{value}</p>
                    </div>
                ),
            },
            {
                Header: "Category",
                accessor: "category",
                Cell: ({ value }) => (
                    <div className="p-4 flex flex-col items-center justify-center">
                        <p className="text-black text-base font-normal">{value}</p>
                    </div>
                ),
            },
            {
                Header: "Level",
                accessor: "type",
                Cell: ({ value }) => (
                    <div className="p-4 flex flex-col items-center justify-center">
                        <p className="text-black text-base font-normal">{value}</p>
                    </div>
                ),
            },
            {
                Header: "Question",
                accessor: "question",
                Cell: ({ value }) => (
                    <div className="p-4 flex flex-col ">
                        <p className="text-black text-base font-normal">
                            {/* {currencySign(value)} */}
                            {value}
                        </p>
                    </div>
                ),
            },
            {
                Header: "Options",
                accessor: "option",
                Cell: ({ value }) => (
                    <div className="p-4 flex flex-col ">
                        {value.map((item, i) => (<p key={i} className="text-black text-base font-normal">
                            {item.name}:{item.ans}
                        </p>))}
                    </div>
                ),
            },
            {
                Header: "Answer",
                accessor: "answer",
                Cell: ({ value }) => (
                    <div className="p-4 flex flex-col items-center justify-center">
                        <p className="text-black text-base font-normal">{value}</p>
                    </div>
                ),
            },
            {
                Header: "Image",
                accessor: "image",
                Cell: ({ value }) => (
                    <div className="p-4 flex items-center justify-center">
                        <img
                            src={value}
                            alt="Product"
                            className="h-[76px] w-[76px] rounded-[10px]"
                        />
                    </div>
                ),
            },
        ],
        []
    );

    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;

    // Slice the data to pass only what's needed for the current page
    const paginatedData = uploadedData.slice(startIndex, endIndex);

    return (
        <div className="w-full h-full bg-transparent md:pt-5 pt-5 pb-5 pl-5 pr-5 overflow-auto">
            <div className="w-full border border-black p-2 rounded mb-4 md:mt-0 mt-6">
                <form className="w-full relative mb-4">
                    <div className="relative w-full">
                        <p className="text-black text-base font-bold pb-1">Genrete Image Url</p>
                        <div className="border rounded-md p-2 w-full bg-custom-light flex justify-start items-center text-custom-blue font-normal">
                            <label htmlFor="file-upload" className="cursor-pointer">
                                Genrete File:
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                // accept=".xlsx, .xls"
                                // onChange={handleJenretteFileUpload}
                                onChange={handleJenretteFileUploaded}
                                className="ml-2"
                            />
                        </div>
                        <div className="flex justify-between items-center w-full gap-5 mt-4">
                            <p className="text-black text-base font-normal" >{jenretteFileData}</p>
                            <button type="button" className="text-white bg-[var(--custom-blue)] rounded-md py-2 px-4" onClick={handleCopy}>Copy</button>
                        </div>
                    </div>

                </form>
            </div>

            <form className="w-full  relative">
                <div className="relative w-full">
                    <div className="border rounded-md p-2 w-full bg-custom-light flex justify-start items-center text-custom-blue font-normal">
                        <label htmlFor="file-upload" className="cursor-pointer">
                            Upload File:
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileUpload}
                            className="ml-2"
                        />
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="mt-4 text-white bg-[var(--custom-blue)] rounded-md py-2 px-4"
                >
                    Submit
                </button>
                <button
                    type="button"
                    onClick={uploadData}
                    className="absolute right-2 mt-4 text-white bg-[var(--custom-blue)] rounded-md py-2 px-4"
                >
                    Upload Data
                </button>
            </form>

            <div className="mb-20">
                <Table
                    columns={columns}
                    data={paginatedData} // Pass sliced data
                    currentPage={pagination.currentPage}
                    setCurrentPage={(page) =>
                        setPagination((prev) => ({ ...prev, currentPage: page }))
                    }
                    pagination={pagination}
                    setPagination={setPagination}
                    pageSize={pagination.itemsPerPage}
                    setPageSize={(pageSize) =>
                        setPagination((prev) => ({
                            ...prev,
                            itemsPerPage: pageSize,
                            totalPages: Math.ceil(uploadedData.length / pageSize),
                            currentPage: 1, // reset to page 1 on page size change
                        }))
                    }
                    totalPages={pagination.totalPages}
                    setTotalPages={(totalPages) =>
                        setPagination((prev) => ({ ...prev, totalPages }))
                    }
                    onPageChange={(page) =>
                        setPagination((prev) => ({ ...prev, currentPage: page }))
                    }
                    itemsPerPage={pagination.itemsPerPage}
                    setItemsPerPage={(itemsPerPage) =>
                        setPagination((prev) => ({
                            ...prev,
                            itemsPerPage,
                            totalPages: Math.ceil(uploadedData.length / itemsPerPage),
                            currentPage: 1, // optional reset
                        }))
                    }
                />
            </div>
        </div>
    );
}

export default UploadProductFromFile;