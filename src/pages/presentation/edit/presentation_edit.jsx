import { useEffect, useMemo, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { BsFillPlayFill } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { Form } from "antd";
import debounce from "lodash/debounce";
import MainHeader from "../../../components/header/main_header/main_header";
import PreviewResult from "./preview_result_and_edit";
import PresentationSingleSlideThumbNail from "./single_slide_thumbnail";
import usePrivateAxios from "../../../configs/networks/usePrivateAxios";

function PresentationEditPage() {
    const { presentationId } = useParams();
    const [selectedIndexView, setSelectedIndexView] = useState(0);
    const [curIndexView, setCurIndexView] = useState(0);
    const [presentationData, setPresentationData] = useState(null);
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const privateAxios = usePrivateAxios();

    const { refetch: presentationQueryRefetch } = useQuery({
        queryKey: ["get_presentation_detail"],
        enabled: false,
        queryFn: async () => {
            return privateAxios
                .get(`presentation/get?presentationId=${presentationId}`)
                .then((response) => {
                    console.log(response);
                    setPresentationData({ ...response?.data });
                    form.setFieldValue("presentationName", response?.data?.name);
                    return response;
                })
                .catch((error) => {
                    console.log("get error");
                    console.log(error);
                });
        }
    });

    async function changeName(newName) {
        let finalNewName = newName.trim();
        if (finalNewName === "") {
            finalNewName = `Untitled_presentation_${presentationData?.timeCreated}`;
        }
        privateAxios
            .get(
                `presentation/update?presentationId=${
                    presentationData?.id ?? 0
                }&name=${finalNewName}`
            )
            .then((response) => {
                console.log(response);
                console.log("name changed successfully");
                setPresentationData((curPresentationData) => {
                    return {
                        ...curPresentationData,
                        name: newName
                    };
                });
                return response;
            })
            .catch((error) => {
                console.log("get error");
                console.log(error);
            });
    }

    const onPresentationNameChanged = async (newName) => {
        console.log("console.log from debounce");
        console.log(newName);
        changeName(newName);
    };
    const debouncePresentatioNnameChanged = useMemo(
        () => debounce(onPresentationNameChanged, 1000),
        [presentationData?.id]
    );

    const updateSlideThumbnail = (slideId, newText, newType) => {
        setPresentationData((curPresentationData) => {
            return {
                ...curPresentationData,
                slides: (curPresentationData?.slides ?? []).map((slide) => {
                    if (slideId === slide.id) {
                        return {
                            ...slide,
                            question: newText,
                            type: newType
                        };
                    }
                    return { ...slide };
                })
            };
        });
    };

    useEffect(() => {
        console.log(presentationId);
        presentationQueryRefetch();
        return () => {
            queryClient.removeQueries({ queryKey: "get_presentation_detail", exact: true });
            queryClient.removeQueries({ queryKey: "get_slide_detail", exact: true });
        };
    }, [presentationId]);

    async function addSlide() {
        privateAxios
            .get(`presentation/addSlide?presentationId=${presentationData?.id ?? 0}`)
            .then((response) => {
                const newSlide = response?.data;
                setPresentationData((curPresentationData) => {
                    return {
                        ...curPresentationData,
                        slides: (curPresentationData?.slides ?? []).concat([
                            {
                                id: newSlide.id,
                                presentationId: newSlide.presentationId,
                                question: newSlide.question
                            }
                        ])
                    };
                });
                return response;
            })
            .catch((error) => {
                console.log("get error");
                console.log(error);
            });
    }

    // const slideList = [
    //     {
    //         id: "temp0",
    //         question: "Nà ní"
    //     },
    //     {
    //         id: "temp1",
    //         question: "Nà ní"
    //     },
    //     {
    //         id: "temp2",
    //         question: "Nà ní"
    //     },
    //     {
    //         id: "temp3",
    //         question: "Nà ní"
    //     },
    //     {
    //         id: "temp4",
    //         question: "Nà ní"
    //     },
    //     {
    //         id: "temp5",
    //         question: "Nà ní"
    //     },
    //     {
    //         id: "temp6",
    //         question: "Nà ní"
    //     }
    // ];

    function renderIconBaseOnType(type, size) {
        if (type === 1) {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    preserveAspectRatio="xMidYMid meet"
                    width={`${size ?? 28}`}
                    height={`${size ?? 28}`}
                    viewBox="0 0 48 48"
                >
                    <title>Heading Paragraph Icon</title>
                    <rect
                        fill="rgb(183, 186, 194)"
                        x="3.93"
                        y="11.04"
                        width="40.92"
                        height="8.66"
                        rx="1.26"
                    />
                    <rect fill="rgb(64, 70, 93)" y="22.31" width="48" height="13.38" rx="1.26" />
                </svg>
            );
        }
        if (type === 2) {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    preserveAspectRatio="xMidYMid meet"
                    width={`${size ?? 28}`}
                    height={`${size ?? 28}`}
                    viewBox="0 0 48 48"
                >
                    <title>Heading Subheading Icon</title>
                    <rect fill="rgb(64, 70, 93)" y="18.05" width="48" height="10.15" rx="1.26" />
                    <rect
                        fill="rgb(183, 186, 194)"
                        x="5.54"
                        y="30.05"
                        width="36.92"
                        height="4.62"
                        rx="1.3"
                    />
                </svg>
            );
        }

        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                preserveAspectRatio="xMidYMid meet"
                width={`${size ?? 28}`}
                height={`${size ?? 28}`}
                viewBox="0 0 48 48"
            >
                <title>Bar Chart Icon</title>
                <rect x="32.73" y="17.04" width="11.4" height="25.25" fill="rgb(231, 232, 235)" />
                <rect x="3.87" y="26.22" width="11.4" height="16.06" fill="rgb(64, 70, 93)" />
                <rect x="18.3" y="4.31" width="11.4" height="37.97" fill="rgb(183, 186, 194)" />
                <rect y="42.28" width="48" height=".99" fill="#000000" />
            </svg>
        );
    }

    function renderSlideThumbnails() {
        const listSlideThumbnails = [];
        const slideList = presentationData?.slides ?? [];
        const { length } = slideList;
        const updateSlideListAfterRemoveSlide = (slideId) => {
            console.log(slideId);
            const currentSlideList = presentationData?.slides?.concat() ?? [];
            console.log(currentSlideList);
            const slideIdIndex = currentSlideList.findIndex((slide) => slide.id === slideId);
            const newSlideList = currentSlideList.filter((slide) => slide.id !== slideId);
            console.log(slideIdIndex);
            console.log(curIndexView);
            console.log(newSlideList);
            if (slideIdIndex === curIndexView && slideIdIndex === currentSlideList.length - 1) {
                setCurIndexView(newSlideList.length - 1);
            }
            setPresentationData((curPresentationData) => {
                return {
                    ...curPresentationData,
                    slides: newSlideList
                };
            });
        };
        for (let i = 0; i < length; i += 1) {
            listSlideThumbnails.push(
                <PresentationSingleSlideThumbNail
                    key={`${slideList[i].id}`}
                    isSelected={i === selectedIndexView}
                    id={slideList[i].id}
                    index={i}
                    icon={renderIconBaseOnType(slideList[i].type, 50)}
                    question={slideList[i].question}
                    onClick={() => setCurIndexView(i)}
                    updateListSlide={updateSlideListAfterRemoveSlide}
                />
            );
        }
        return listSlideThumbnails;
    }

    if (!presentationData) {
        return null;
    }
    console.log(presentationData);

    return (
        <>
            <MainHeader />
            <div className="flex flex-col w-full h-[90%] overflow-hidden">
                <div className="flex flex-row items-center justify-between bg-white mt-[-2px] py-2 px-8 border-b-[0.5px] border-b-neutral-500">
                    <Form
                        form={form}
                        layout="inline"
                        className="w-[30%]"
                        onValuesChange={(changedValues) => {
                            debouncePresentatioNnameChanged(changedValues.presentationName);
                        }}
                    >
                        <Form.Item name="presentationName" className="mt-1 w-full" initialValue="">
                            <input
                                name="presentationName"
                                placeholder="Presentation name"
                                className="
                                    focus:ring-purple-600 focus:border-purple-500
                                    focus:shadow-purple-300
                                    focus:shadow-inner
                                    focus:outline-none hover:border-purple-400
                                    block w-full sm:text-sm border-gray-300
                                    px-2 py-3 bg-white border rounded-md "
                            />
                        </Form.Item>
                    </Form>
                    <div className="flex">
                        <button
                            type="button"
                            onClick={() => addSlide()}
                            className="mr-3 bg-purple-500 flex justify-center items-center px-2 py-2 rounded-md text-white"
                        >
                            <IoMdAdd className="mr-1" />
                            New slide
                        </button>
                        <button
                            type="button"
                            className="bg-purple-500 flex justify-center items-center px-2 py-2 rounded-md text-white"
                        >
                            <BsFillPlayFill className="mr-1" />
                            Present
                        </button>
                    </div>
                </div>
                <div className="flex flex-row w-full max-h-full h-screen overflow-hidden">
                    <div
                        id="presentation_thumbnail_list"
                        className="h-full overflow-auto sm:w-[20%] lg:w-[15%] xl:w-[12.5%] 2xl:w-[11%] text-cyan-200"
                    >
                        {renderSlideThumbnails()}
                    </div>
                    <PreviewResult
                        id={presentationData?.slides?.[curIndexView]?.id ?? 0}
                        parentSelectedIndex={selectedIndexView}
                        parentCurIndexView={curIndexView}
                        parentSetSelectedIndexView={(newSelectedIndexView) =>
                            setSelectedIndexView(newSelectedIndexView)
                        }
                        parentSetSlideQuestion={updateSlideThumbnail}
                        renderIcon={(type) => renderIconBaseOnType(type)}
                    />
                </div>
            </div>
        </>
    );
}

export default PresentationEditPage;
