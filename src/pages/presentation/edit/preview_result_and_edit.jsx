// import PropTypes from "prop-types";
import { RiCloseFill } from "react-icons/ri";

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

function PreviewResultAndEdit() {
    const { register, handleSubmit } = useForm();

    const onSubmit = (dataSubmit) => console.log(dataSubmit);

    const quizData = {
        question: "Nà ní",
        rightAnwser: "Dunno",
        listOption: [
            {
                anwser: "Option1",
                amount: 10,
                fill: "#f72585"
            },
            {
                anwser: "Option1",
                amount: 100,
                fill: "#7209b7"
            },
            {
                anwser: "Option1",
                amount: 300,
                fill: "#3a0ca3"
            },
            {
                anwser: "Option1",
                amount: 0,
                fill: "#4361ee"
            }
        ]
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

    function renderOptionInputs() {
        const listOptionInputs = [];
        const { length } = quizData.listOption;
        for (let i = 0; i < length; i += 1) {
            const wrapperClassName = `flex flex-row items-center ${
                i === length - 1 ? "mb-0" : "mb-2"
            }`;
            const name = `option${i + 1}`;
            listOptionInputs.push(
                <div className={wrapperClassName}>
                    <input
                        name={name}
                        className="shadow-sm mr-2
                                        focus:ring-indigo-500 focus:border-indigo-500 mt-1
                                        block w-full sm:text-sm border-gray-300
                                        px-2 py-3 bg-white border rounded-md "
                        id="username"
                        type="text"
                        placeholder="Option4"
                        {...register(name, { required: "Username is required." })}
                    />
                    <RiCloseFill size={30} className="cursor-pointer" />
                </div>
            );
        }
        return listOptionInputs;
    }

    return (
        <div className="flex flex-row h-full bg-neutral-300 w-full sm:w-[78%] lg:w-[83%] xl:w-[87.5%]">
            <div className="grow flex flex-col justify-center items-center mx-5 my-10 bg-white">
                <p className="text-5xl text-slate-500 mb-5">{quizData.question}</p>
                <ResponsiveContainer width="70%" height="80%">
                    <BarChart
                        width={150}
                        height={40}
                        data={quizData.listOption}
                        margin={{ top: 30 }}
                    >
                        <XAxis dataKey="name" tick={{ fill: "rgb(163 163 163)" }} />
                        <Bar dataKey="amount" fill="#8884d8">
                            <LabelList dataKey="amount" content={renderCustomizedLabel} />
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
                        {renderOptionInputs()}
                    </div>
                </form>
            </div>
        </div>
    );
}

// PreviewResultAndEdit.propTypes = {
//     id: PropTypes.string,
//     index: PropTypes.number,
//     question: PropTypes.string,
//     isSelected: PropTypes.bool
// };

// PreviewResultAndEdit.defaultProps = {
//     id: "",
//     index: 0,
//     question: "",
//     isSelected: false
// };

export default PreviewResultAndEdit;
