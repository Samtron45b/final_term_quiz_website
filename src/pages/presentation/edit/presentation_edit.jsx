import { useState } from "react";
import { useForm } from "react-hook-form";
import MainHeader from "../../../components/header/main_header/main_header";
import PreviewResult from "./preview_result_and_edit";
import PresentationSingleSlideThumbNail from "./single_slide_thumbnail";

function PresentationEditPage() {
    const [selectedIndexView, setSelectedIndexView] = useState(0);
    const { register, handleSubmit } = useForm();

    const onSubmit = (presentationName) => console.log(presentationName);

    const slideList = [
        {
            id: "temp0",
            question: "Nà ní"
        },
        {
            id: "temp1",
            question: "Nà ní"
        },
        {
            id: "temp2",
            question: "Nà ní"
        },
        {
            id: "temp3",
            question: "Nà ní"
        },
        {
            id: "temp4",
            question: "Nà ní"
        },
        {
            id: "temp5",
            question: "Nà ní"
        },
        {
            id: "temp6",
            question: "Nà ní"
        }
    ];

    function renderSlideThumbnails() {
        const listSlideThumbnails = [];
        const { length } = slideList;
        for (let i = 0; i < length; i += 1) {
            listSlideThumbnails.push(
                <PresentationSingleSlideThumbNail
                    key={slideList[i].id}
                    isSelected={i === selectedIndexView}
                    id={slideList[i].id}
                    index={i}
                    question={slideList[i].question}
                    onClick={() => setSelectedIndexView(i)}
                />
            );
        }
        return listSlideThumbnails;
    }

    return (
        <>
            <MainHeader />
            <div className="flex flex-col w-full h-[90%] overflow-hidden">
                <div className="bg-white mt-[-2px] py-2 pl-8 border-b-[0.5px] border-b-neutral-500">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input
                            name="presentationName"
                            placeholder="Presentation name"
                            className="shadow-sm
                                    focus:ring-indigo-500 focus:border-indigo-500 mt-1
                                    block w-[30%] sm:text-sm border-gray-300
                                    px-2 py-3 bg-white border rounded-md "
                            {...register("presentationName")}
                        />
                    </form>
                </div>
                <div className="flex flex-row w-full overflow-hidden">
                    <div
                        id="presentation_thumbnail_list"
                        className="h-full overflow-auto sm:w-[22%] lg:w-[17%] xl:w-[15%] 2xl:w-[12.5%] text-cyan-200"
                    >
                        {renderSlideThumbnails()}
                    </div>
                    <PreviewResult />
                </div>
            </div>
        </>
    );
}

export default PresentationEditPage;
