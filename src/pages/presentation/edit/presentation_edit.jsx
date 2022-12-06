import { useState } from "react";
import MainHeader from "../../../components/header/main_header/main_header";
import PresentationSingleSlideThumbNail from "./single_slide_thumbnail";

function PresentationEditPage() {
    const [selectedIndexView, setSelectedIndexView] = useState(0);

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
            id: "temp4",
            question: "Nà ní"
        },
        {
            id: "temp4",
            question: "Nà ní"
        }
    ];

    function renderSlideThumbnails() {
        const listSlideThumbnails = [];
        const { length } = slideList;
        for (let i = 0; i < length; i += 1) {
            listSlideThumbnails.push(
                <PresentationSingleSlideThumbNail
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
            <div className="flex flex-row h-screen w-full">
                <div className="h-full overflow-auto min-w-[20%] text-cyan-200">
                    {renderSlideThumbnails()}
                </div>
                <div className="h-min overflow-auto w-[40%] bg-green-400">Hello2</div>
            </div>
        </>
    );
}

export default PresentationEditPage;
