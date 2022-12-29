import PropTypes from "prop-types";
import {
    BarChart,
    Bar,
    // Cell,
    XAxis,
    // YAxis,
    // CartesianGrid,
    // Tooltip,
    // Legend,
    LabelList,
    ResponsiveContainer
} from "recharts";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { ImSpinner10 } from "react-icons/im";
import usePrivateAxios from "../../../configs/networks/usePrivateAxios";

function PresentationMainView({ slideId, isViewer }) {
    const [slideDetailData, setSlideDetailData] = useState(null);
    const privateAxios = usePrivateAxios();
    console.log(slideId, slideDetailData, isViewer);

    const { refetch: slideQueryRefetch, isFetching: isSlideQueryFecthcing } = useQuery({
        queryKey: ["get_slide_present_data"],
        enabled: false,
        queryFn: async () => {
            return privateAxios
                .get(`presentation/getSlide?slideId=${slideId}`)
                .then((response) => {
                    console.log(response);
                    setSlideDetailData({ ...response?.data });
                    return response;
                })
                .catch((error) => {
                    console.log("get error");
                    console.log(error);
                    setSlideDetailData(null);
                });
        }
    });

    useEffect(() => {
        slideQueryRefetch();
    }, [slideId]);

    if (isSlideQueryFecthcing) {
        return (
            <div className="flex justify-center items-center">
                <ImSpinner10 size={50} className="animate-spin mr-3 mb-2" />
            </div>
        );
    }

    if (slideDetailData) {
        return (
            <div className="flex justify-center mt-10">
                <p className="text-4xl text-neutral-300">Cannot get data for this slide.</p>
            </div>
        );
    }

    const renderCustomizedLabel = (propTypes) => {
        const { x, y, width, value } = propTypes;
        const radius = 10;

        return (
            <g>
                <text
                    x={x + width / 2}
                    y={y - radius}
                    fill="rgb(163 163 163)"
                    textAnchor="middle"
                    dominantBaseline="middle"
                >
                    {value}
                </text>
            </g>
        );
    };

    return (
        <div className="relative flex flex-col w-full h-screen justify-center items-center bg-white">
            <div className="absolute px-2 py-3 left-[5%] w-[20%] h-[40%] rounded-md overflow-x-hidden overflow-y-auto shadow-lg">
                abc
            </div>
            <p className="mb-3 w-[90%] max-h-[30%] text-3xl leading-none text-slate-500 overflow-hidden text-center break-words">
                {slideDetailData?.question ?? "Question"}
            </p>
            {slideDetailData?.type === 0 ? (
                <ResponsiveContainer width="70%" className="max-h-[60%]">
                    <BarChart
                        width={150}
                        height={40}
                        data={slideDetailData?.options ?? []}
                        margin={{ top: 30 }}
                    >
                        <XAxis dataKey="optionText" tick={{ fill: "rgb(163 163 163)" }} />
                        <Bar dataKey="answerAmount" fill="#8884d8">
                            <LabelList dataKey="answerAmount" content={renderCustomizedLabel} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-xl max-w-[90%] text-slate-300 text-center break-all">
                    {slideDetailData?.subtext}
                </p>
            )}
        </div>
    );
}

PresentationMainView.propTypes = {
    slideId: PropTypes.number,
    isViewer: PropTypes.bool
};
PresentationMainView.defaultProps = {
    slideId: 0,
    isViewer: false
};

export default PresentationMainView;
