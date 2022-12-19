import PropTypes from "prop-types";
import { RiCloseFill } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
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
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Form } from "antd";
import debounce from "lodash/debounce";
import usePrivateAxios from "../../../configs/networks/usePrivateAxios";

function PreviewResultAndEdit({
    id,
    parentSelectedIndex,
    parentCurIndexView,
    parentSetSelectedIndexView,
    parentSetSlideQuestion
}) {
    const [slideDetailData, setSlideDetailData] = useState(null);
    const [form] = Form.useForm();
    const privateAxios = usePrivateAxios();

    const { refetch: slideQueryRefetch, isFetching: isSlideQueryFecthcing } = useQuery({
        queryKey: ["get_slide_detail"],
        enabled: false,
        queryFn: async () => {
            return privateAxios
                .get(`presentation/getSlide?slideId=${id}`)
                .then((response) => {
                    console.log(response);
                    setSlideDetailData({ ...response?.data });
                    return response;
                })
                .catch((error) => {
                    console.log("get error");
                    console.log(error);
                });
        }
    });

    function setValueForOptionList(listOptions) {
        const currentOptionMap = listOptions.map((option) => {
            return Object.fromEntries(new Map([[`${option.id}`, option.optionText]]));
        });
        form.setFieldValue(`slide${id}_options`, currentOptionMap);
    }

    useEffect(() => {
        async function fectchData() {
            await slideQueryRefetch().then((response) => {
                form.setFieldValue("question", response?.data?.data?.question ?? "");
                setValueForOptionList(response?.data?.data?.options ?? []);
            });
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

    // on question changed handler
    const onSlideQuestionChanged = async (newQuestion) => {
        console.log("console.log from debounce (question)");
        console.log(newQuestion);
        setSlideDetailData((curSlideDetailData) => {
            return {
                ...curSlideDetailData,
                question: newQuestion
            };
        });
        parentSetSlideQuestion?.(newQuestion, id, 0);
        privateAxios
            .get(`presentation/updateSlide?slideId=${id ?? 0}&question=${newQuestion}`)
            .then((response) => {
                console.log(response);
                console.log(`question changed successfully for slide ${id}`);
                return response;
            })
            .catch((error) => {
                console.log("get error");
                console.log(error);
            });
    };
    const debounceSlideQuestionChanged = useMemo(
        () => debounce(onSlideQuestionChanged, 1000),
        [id]
    );

    // on add option handler
    const onAddOption = async () => {
        const listOptions = slideDetailData?.options ?? [];
        privateAxios
            .get(
                `presentation/addOption?slideId=${id ?? 0}&optionText=Answer ${
                    listOptions.length + 1
                }&isCorrect=${false}`
            )
            .then((response) => {
                console.log(response);
                console.log(`add option successfully for slide ${id}`);
                const newOptionsList = listOptions.concat([
                    {
                        id: response?.data?.id ?? 0,
                        slideId: id,
                        optionText: response?.data?.optionText ?? "",
                        isCorrect: response?.data?.isCorrect ?? false,
                        answerAmount: response?.data?.answerAmount ?? 0
                    }
                ]);
                setSlideDetailData((curSlideDetailData) => {
                    return {
                        ...curSlideDetailData,
                        options: newOptionsList
                    };
                });
                setValueForOptionList(newOptionsList);
                return response;
            })
            .catch((error) => {
                console.log("get error");
                console.log(error);
            });
    };
    // on remove option handler
    const onDeleteOption = async (optionId) => {
        const listOptions = slideDetailData?.options ?? [];
        return privateAxios
            .get(`presentation/deleteOption?optionId=${optionId}`)
            .then((response) => {
                console.log(response);
                console.log(`delete option ${optionId} successfully for slide ${id}`);
                const newOptionsList = listOptions.filter((option) => option.id !== optionId);
                setSlideDetailData((curSlideDetailData) => {
                    return {
                        ...curSlideDetailData,
                        options: newOptionsList
                    };
                });
                setValueForOptionList(newOptionsList);
            })
            .catch((error) => {
                console.log("get error");
                console.log(error);
            });
    };
    // on change option's text handler
    const onChangeOptionText = async (optionIndex, newText, newIsCorrect) => {
        const listOptions = slideDetailData?.options ?? [];
        const optionId = listOptions[optionIndex]?.id;
        const finalNewText = newText ?? listOptions[optionIndex]?.optionText;
        const finalIsCorrect = newIsCorrect ?? listOptions[optionIndex]?.isCorrect;
        console.log(listOptions, optionId, finalNewText, finalIsCorrect);
        privateAxios
            .get(
                `presentation/updateOption?optionId=${optionId}&optionText=${finalNewText}&isCorrect=${finalIsCorrect}`
            )
            .then((response) => {
                console.log(response);
                console.log(`update option ${optionId} successfully for slide ${id}`);
                const newOptionsList = listOptions.map((option) => {
                    if (option.id === optionId) {
                        return {
                            id: optionId,
                            slideId: id,
                            optionText: finalNewText ?? "",
                            isCorrect: finalIsCorrect ?? false,
                            answerAmount: option.answerAmount
                        };
                    }
                    return { ...option };
                });
                setSlideDetailData((curSlideDetailData) => {
                    return {
                        ...curSlideDetailData,
                        options: newOptionsList
                    };
                });
                setValueForOptionList(newOptionsList);
            })
            .catch((error) => {
                console.log("get error");
                console.log(error);
            });
    };
    const debounceOptionChanged = useMemo(() => debounce(onChangeOptionText, 1000), [id]);

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
        const listOptions = slideDetailData?.options ?? [];
        console.log(form.getFieldsValue(true));
        return (
            <Form.List name={`slide${id}_options`}>
                {(fieldNameHead) => (
                    <>
                        <span className="text-lg font-medium text-gray-700">Options</span>
                        <button
                            type="button"
                            className="bg-neutral-400 opacity-70 w-full flex justify-center items-center px-2 py-3 rounded-md text-white"
                            onClick={async () => {
                                onAddOption();
                            }}
                        >
                            <IoMdAdd className="mr-1" />
                            Add options &#40;up to 4&#41;
                        </button>
                        {fieldNameHead.map((optionField, index) => {
                            const optionName = [index, `${listOptions[index]?.id}`];
                            console.log(optionName);
                            return (
                                <div key={optionName} className="flex flex-row items-center mt-3">
                                    <Form.Item
                                        name={optionName}
                                        className="mr-2 mb-0 w-full"
                                        initialValue=""
                                    >
                                        <input
                                            name={optionName}
                                            className="
                                                focus:ring-purple-600 focus:border-purple-500
                                                focus:shadow-purple-300
                                                focus:shadow-inner
                                                focus:outline-none hover:border-purple-400
                                                block w-full sm:text-sm border-gray-300
                                                px-2 py-3 bg-white border rounded-md "
                                        />
                                    </Form.Item>
                                    <RiCloseFill
                                        size={30}
                                        className="cursor-pointer"
                                        onClick={async () => {
                                            onDeleteOption(listOptions[index].id);
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </>
                )}
            </Form.List>
        );
    }

    if (!slideDetailData) {
        return null;
    }
    console.log(slideDetailData);

    return (
        <div className="flex flex-row overflow-auto bg-neutral-300 w-full sm:w-[80%] lg:w-[85%] xl:w-[90%]">
            <div className="grow flex flex-col justify-center items-center mx-5 my-10 bg-white">
                <p className="text-5xl text-slate-500 mb-5">
                    {slideDetailData?.question ?? "Question"}
                </p>
                <ResponsiveContainer width="70%" height="80%">
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
            </div>
            <div className="bg-white w-[440px] h-screen px-5 pt-4 pb-8">
                <div className="font-bold text-2xl text-center">Content</div>
                <Form
                    form={form}
                    layout="vertical"
                    className="mt-7"
                    onValuesChange={(changedValues) => {
                        console.log(changedValues);
                        const changedField = Object.keys(changedValues)[0];
                        if (changedField === "question") {
                            debounceSlideQuestionChanged(changedValues.question);
                        } else if (changedField === `slide${id}_options`) {
                            const listOptions = changedValues[`slide${id}_options`] ?? [];
                            const { length } = listOptions;
                            let changedOption;
                            let optionIndex;
                            for (let i = 0; i < length; i += 1) {
                                if (listOptions[i] !== undefined) {
                                    changedOption = { ...listOptions[i] };
                                    optionIndex = i;
                                    break;
                                }
                            }
                            console.log("console at changed");
                            console.log(listOptions);
                            console.log(changedOption);
                            debounceOptionChanged(optionIndex, Object.entries(changedOption)[0][1]);
                        }
                    }}
                >
                    <Form.Item
                        name="question"
                        className="mt-1 w-full"
                        label={<p className="text-lg font-medium text-gray-700">Question</p>}
                        initialValue=""
                    >
                        <input
                            name="question"
                            placeholder="Question"
                            className="
                                mt-[-4px]
                                focus:ring-purple-600 focus:border-purple-500
                                focus:shadow-purple-300
                                focus:shadow-inner
                                focus:outline-none hover:border-purple-400
                                block w-full sm:text-sm font-medium border-gray-300
                                px-2 py-3 bg-white border rounded-md "
                        />
                    </Form.Item>
                    {renderOptionInputs()}
                </Form>
            </div>
        </div>
    );
}

PreviewResultAndEdit.propTypes = {
    id: PropTypes.number,
    parentSelectedIndex: PropTypes.number,
    parentCurIndexView: PropTypes.number,
    parentSetSelectedIndexView: PropTypes.func,
    parentSetSlideQuestion: PropTypes.func
};

PreviewResultAndEdit.defaultProps = {
    id: 0,
    parentSelectedIndex: 0,
    parentCurIndexView: 0,
    parentSetSelectedIndexView: null,
    parentSetSlideQuestion: null
};

export default PreviewResultAndEdit;
