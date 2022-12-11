import PropTypes from "prop-types";
import { RiCloseFill } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import { useForm } from "react-hook-form";
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
import { useEffect } from "react";
import { useQuery } from "react-query";
import usePrivateAxios from "../../../configs/networks/usePrivateAxios";

function PreviewResultAndEdit({
    id,
    parentSelectedIndex,
    parentCurIndexView,
    parentSetSelectedIndexView
}) {
    const { register, handleSubmit, setValue } = useForm();

    const onSubmit = (dataSubmit) => console.log(dataSubmit);

    const privateAxios = usePrivateAxios();

    const {
        data: slideQueryRes,
        refetch: slideQueryRefetch,
        isFetching: isSlideQueryFecthcing
    } = useQuery({
        queryKey: ["get_slide_detail"],
        enabled: false,
        queryFn: async () => {
            return privateAxios
                .get(`presentation/getSlide?slideId=${id}`)
                .then((response) => {
                    console.log(response);
                    setValue("question", response?.data?.question ?? "");
                    return response;
                })
                .catch((error) => {
                    console.log("get error");
                    console.log(error);
                });
        }
    });

    useEffect(() => {
        async function fectchData() {
            await slideQueryRefetch();
            if (!isSlideQueryFecthcing && parentCurIndexView !== parentSelectedIndex) {
                parentSetSelectedIndexView(parentCurIndexView);
            }
        }
        fectchData();
    }, [id]);

    // const quizData = {
    //     question: "Nà ní",
    //     rightAnwser: "Dunno",
    //     listOption: [
    //         {
    //             anwser: "Option1",
    //             amount: 10,
    //             fill: "#f72585"
    //         },
    //         {
    //             anwser: "Option1",
    //             amount: 100,
    //             fill: "#7209b7"
    //         },
    //         {
    //             anwser: "Option1",
    //             amount: 300,
    //             fill: "#3a0ca3"
    //         },
    //         {
    //             anwser: "Option1",
    //             amount: 0,
    //             fill: "#4361ee"
    //         }
    //     ]
    // };

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

    function renderOptionInputs() {
        const listOptions = slideQueryRes?.data?.options ?? [];
        const listOptionInputs = [];
        const { length } = listOptions;
        for (let i = 0; i < length; i += 1) {
            const name = `option${i + 1}`;
            setValue(name, listOptions[i].optionText ?? "");
            listOptionInputs.push(
                <div key={name} className="flex flex-row items-center mt-2">
                    <input
                        name={name}
                        className="shadow-sm mr-2
                                        focus:ring-indigo-500 focus:border-indigo-500 mt-1
                                        block w-full sm:text-sm border-gray-300
                                        px-2 py-3 bg-white border rounded-md "
                        id="username"
                        type="text"
                        placeholder="Option4"
                        {...register(name)}
                    />
                    <RiCloseFill size={30} className="cursor-pointer" />
                </div>
            );
        }
        return listOptionInputs;
    }

    if (!slideQueryRes) {
        return null;
    }

    return (
        <div className="flex flex-row max-h-full h-screen bg-neutral-300 w-full sm:w-[80%] lg:w-[85%] xl:w-[90%]">
            <div className="grow flex flex-col justify-center items-center mx-5 my-10 bg-white">
                <p className="text-5xl text-slate-500 mb-5">
                    {slideQueryRes?.data?.question ?? "Question"}
                </p>
                <ResponsiveContainer width="70%" height="80%">
                    <BarChart
                        width={150}
                        height={40}
                        data={slideQueryRes?.data?.options ?? []}
                        margin={{ top: 30 }}
                    >
                        <XAxis dataKey="optionText" tick={{ fill: "rgb(163 163 163)" }} />
                        <Bar dataKey="answerAmount" fill="#8884d8">
                            <LabelList dataKey="answerAmount" content={renderCustomizedLabel} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-white w-[440px] px-5 pt-4 pb-8">
                <div className="font-bold text-2xl text-center">Content</div>
                <form className="mt-7" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label
                            className="block text-lg font-medium text-gray-700"
                            htmlFor="question"
                        >
                            Question
                            <input
                                name="question"
                                placeholder="Question"
                                className="shadow-sm
                                    focus:ring-indigo-500 focus:border-indigo-500 mt-1
                                    block w-full sm:text-sm border-gray-300
                                    px-2 py-3 bg-white border rounded-md "
                                {...register("question")}
                            />
                        </label>
                    </div>
                    <div className="mb-3">
                        <span className="text-lg font-medium text-gray-700">Options</span>
                        <button
                            type="button"
                            className="bg-neutral-400 opacity-70 w-full flex justify-center items-center px-2 py-3 rounded-md text-white"
                            onClick={() => {}}
                        >
                            <IoMdAdd className="mr-1" />
                            Add options &#40;up to 4&#41;
                        </button>
                        {renderOptionInputs()}
                    </div>
                </form>
            </div>
        </div>
    );
}

PreviewResultAndEdit.propTypes = {
    id: PropTypes.string,
    parentSelectedIndex: PropTypes.number,
    parentCurIndexView: PropTypes.number,
    parentSetSelectedIndexView: PropTypes.func
};

PreviewResultAndEdit.defaultProps = {
    id: "",
    parentSelectedIndex: 0,
    parentCurIndexView: 0,
    parentSetSelectedIndexView: null
};

export default PreviewResultAndEdit;
