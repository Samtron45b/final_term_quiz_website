/* eslint-disable no-unused-vars */
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
import { useCallback, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { ImSpinner10 } from "react-icons/im";
import usePrivateAxios from "../../../configs/networks/usePrivateAxios";
import SelectOptionsField from "./select_options_field";
import { SocketContext } from "../../../components/contexts/socket_context";
import { convertTimeStampToDate } from "../../../utilities";
import AuthContext from "../../../components/contexts/auth_context";

function PresentationMainView({ slideId, isViewer, nameSpace, setParentResultData }) {
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const [slideDetailData, setSlideDetailData] = useState(null);
    const [submittedOption, setSubmittedOption] = useState(0);
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
                    const length = response?.data?.options?.length ?? 0;
                    if (isViewer) {
                        for (let i = 0; i < length; i += 1) {
                            const option = response?.data?.options?.[i];
                            if (option?.userAnswer?.user === user.username) {
                                setSubmittedOption(option.id);
                                break;
                            }
                        }
                    }
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
        setSubmittedOption(0);
    }, [slideId]);

    const handleNewResultEvent = useCallback((resultObject) => {
        console.log("new result", resultObject);
        const { optionId, optionText, question, timeAnswered, user: userAnswer } = resultObject;
        if (userAnswer === user.username) {
            setSubmittedOption(optionId);
        }
        setSlideDetailData((currentSlideDeatilData) => {
            const newOptions = currentSlideDeatilData?.options?.map((option) => {
                if (option.id === optionId) {
                    return { ...option, answerAmount: option.answerAmount + 1 };
                }
                return { ...option };
            });
            return { ...currentSlideDeatilData, options: newOptions };
        });
        if (!isViewer) {
            setParentResultData((currentResultData) => {
                return currentResultData.concat([
                    { user: userAnswer, optionText, question, timeAnswered }
                ]);
            });
        }
    }, []);

    useEffect(() => {
        console.log("nameSpace", nameSpace);
        socket.on(`${nameSpace}newResult`, handleNewResultEvent);
        return () => {
            socket.off(`${nameSpace}newResult`, handleNewResultEvent);
        };
    }, [nameSpace, slideDetailData]);

    if (isSlideQueryFecthcing) {
        return (
            <div className="flex justify-center items-center">
                <ImSpinner10 size={50} className="animate-spin mr-3 mb-2" />
            </div>
        );
    }

    if (!slideDetailData) {
        return (
            <div className="flex justify-center mt-10">
                <p className="text-4xl text-neutral-300">Cannot get data for this slide.</p>
            </div>
        );
    }

    const getSubmittedOptionText = () => {
        const chosenOption = (slideDetailData?.options ?? []).find(
            (option) => option.id === submittedOption
        );
        console.log("chosenOption", chosenOption);
        return chosenOption?.optionText;
    };
    const renderAfterSubmitOptionField = () => {
        return (
            <div className="w-full h-full overflow-x-hidden overflow-y-auto break-words bg-white">
                <p className="text-lg text-neutral-500 font-medium">You choosed:</p>
                <p className="text-2xl text-neutral-500 opacity-90">{getSubmittedOptionText()}</p>
            </div>
        );
    };
    const renderOptionsField = () => {
        if (!isViewer || slideDetailData?.type !== 0) return null;
        if (submittedOption === 0) {
            return <SelectOptionsField optionsList={slideDetailData?.options ?? []} />;
        }
        return renderAfterSubmitOptionField();
    };

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
        <div className="relative flex flex-col w-full h-full justify-center items-center bg-white">
            <div className="absolute left-[5%] w-[21%] h-[60%] overflow-x-hidden overflow-y-auto break-words ">
                {renderOptionsField()}
            </div>
            <p className="pt-1 pb-2 w-[40%] max-h-[15%] text-3xl leading-none font-bold text-slate-500 overflow-hidden text-center break-words">
                {slideDetailData?.question ?? "Question"}
            </p>
            {slideDetailData?.type === 0 ? (
                <ResponsiveContainer width="45%" className=" max-h-[65%]">
                    <BarChart
                        width={150}
                        height={40}
                        data={slideDetailData?.options ?? []}
                        margin={{ top: 30 }}
                    >
                        <XAxis dataKey="optionText" tick={{ fill: "rgb(115 115 115)" }} />
                        <Bar dataKey="answerAmount" fill="#8884d8">
                            <LabelList dataKey="answerAmount" content={renderCustomizedLabel} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-xl max-w-[90%] text-slate-500 font-medium text-center break-all">
                    {slideDetailData?.subtext}
                </p>
            )}
        </div>
    );
}

PresentationMainView.propTypes = {
    slideId: PropTypes.number,
    isViewer: PropTypes.bool,
    nameSpace: PropTypes.string,
    setParentResultData: PropTypes.func
};
PresentationMainView.defaultProps = {
    slideId: 0,
    isViewer: true,
    nameSpace: "",
    setParentResultData: null
};

export default PresentationMainView;
