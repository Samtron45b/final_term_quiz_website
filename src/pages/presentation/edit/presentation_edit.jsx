import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdAdd } from "react-icons/io";
import { BsFillPlayFill } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import MainHeader from "../../../components/header/main_header/main_header";
import PreviewResult from "./preview_result_and_edit";
import PresentationSingleSlideThumbNail from "./single_slide_thumbnail";
import usePrivateAxios from "../../../configs/networks/usePrivateAxios";

function PresentationEditPage() {
    const { presentationId } = useParams();
    const [selectedIndexView, setSelectedIndexView] = useState(0);
    const [curIndexView, setCurIndexView] = useState(0);
    const [presentationData, setPresentationData] = useState(null);
    const { register, reset } = useForm();
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
                    reset({ presentationName: response?.data?.name });
                    return response;
                })
                .catch((error) => {
                    console.log("get error");
                    console.log(error);
                });
        }
    });

    useEffect(() => {
        presentationQueryRefetch();
        return () => {
            queryClient.removeQueries({ queryKey: "get_presentation_detail", exact: true });
            queryClient.removeQueries({ queryKey: "get_slide_detail", exact: true });
        };
    }, []);

    async function addSlide() {
        privateAxios
            .get(`presentation/addSlide?presentationId=${presentationData?.id ?? 0}`)
            .then((response) => {
                const newSlide = response?.data;
                setPresentationData({
                    ...presentationData,
                    slides: (presentationData?.slides ?? []).concat([
                        {
                            id: newSlide.id,
                            presentationId: newSlide.presentationId,
                            question: newSlide.question
                        }
                    ])
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

    function renderSlideThumbnails() {
        const listSlideThumbnails = [];
        const slideList = presentationData?.slides ?? [];
        const { length } = slideList;
        const updateSlideListAfterRemoveSlide = (slideId) => {
            console.log(slideId);
            const currentSlideList = presentationData?.slides?.concat() ?? [];
            console.log(currentSlideList);
            const slideIdIndex = currentSlideList.findIndex((slide) => `${slide.id}` === slideId);
            const newSlideList = currentSlideList.filter((slide) => `${slide.id}` !== slideId);
            console.log(slideIdIndex);
            console.log(curIndexView);
            console.log(newSlideList);
            if (slideIdIndex === curIndexView && slideIdIndex === currentSlideList.length - 1) {
                setCurIndexView(newSlideList.length - 1);
            }
            setPresentationData({
                ...presentationData,
                slides: newSlideList
            });
        };
        for (let i = 0; i < length; i += 1) {
            listSlideThumbnails.push(
                <PresentationSingleSlideThumbNail
                    key={`${slideList[i].id}`}
                    isSelected={i === selectedIndexView}
                    id={`${slideList[i].id}`}
                    index={i}
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
                    <form className="w-[30%]">
                        <input
                            name="presentationName"
                            placeholder="Presentation name"
                            className="shadow-sm
                                    focus:ring-indigo-500 focus:border-indigo-500 mt-1
                                    block w-full sm:text-sm border-gray-300
                                    px-2 py-3 bg-white border rounded-md "
                            {...register("presentationName")}
                        />
                    </form>
                    <div className="flex">
                        <button
                            type="button"
                            onClick={() => addSlide()}
                            className="mr-3 bg-purple-500 flex justify-center items-center px-2 py-3 rounded-md text-white"
                        >
                            <IoMdAdd className="mr-1" />
                            New slide
                        </button>
                        <button
                            type="button"
                            className="bg-purple-500 flex justify-center items-center px-2 py-3 rounded-md text-white"
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
                        id={`${presentationData?.slides?.[curIndexView]?.id ?? 0}`}
                        parentSelectedIndex={selectedIndexView}
                        parentCurIndexView={curIndexView}
                        parentSetSelectedIndexView={(newSelectedIndexView) =>
                            setSelectedIndexView(newSelectedIndexView)
                        }
                    />
                </div>
            </div>
        </>
    );
}

export default PresentationEditPage;
