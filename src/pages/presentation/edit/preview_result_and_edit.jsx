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
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Form, Select } from "antd";
import debounce from "lodash/debounce";
import usePrivateAxios from "../../../configs/networks/usePrivateAxios";
import OptionForm from "./option_form";

function PreviewResultAndEdit({
    id,
    parentSelectedIndex,
    parentCurIndexView,
    parentSetSelectedIndexView,
    parentSetSlideQuestion,
    renderIcon
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
                form.setFieldValue("type", `${response?.data?.data?.type ?? 0}`);
                setValueForOptionList(response?.data?.data?.options ?? []);
            });
            if (!isSlideQueryFecthcing && parentCurIndexView !== parentSelectedIndex) {
                parentSetSelectedIndexView(parentCurIndexView);
            }
        }
        fectchData();
    }, [id]);

    // question (also header or title) or type changed handler
    const onSlideQuestionOrTypeChanged = async (newQuestion, newType) => {
        console.log("console.log from debounce (question)");
        console.log(newQuestion, newType);
        if (newQuestion === slideDetailData?.question && newType === slideDetailData?.type) return;
        privateAxios
            .get(
                `presentation/updateSlide?slideId=${
                    id ?? 0
                }&question=${newQuestion}&slideType=${newType}`
            )
            .then((response) => {
                console.log(response);
                console.log(`question or type changed successfully for slide ${id}`);
                setSlideDetailData((curSlideDetailData) => {
                    return {
                        ...curSlideDetailData,
                        question: newQuestion,
                        type: newType
                    };
                });
                form.setFieldValue("question", newQuestion);
                parentSetSlideQuestion?.(id, newQuestion, newType);
                return response;
            })
            .catch((error) => {
                console.log("get error");
                console.log(error);
            });
    };
    const debounceSlideQuestionOrTypeChanged = useMemo(
        () => debounce(onSlideQuestionOrTypeChanged, 1000),
        [id]
    );

    // subtext changed handler
    const onSlideSubTextChanged = async (newSubtext) => {
        console.log("console.log from debounce (question)");
        console.log(newSubtext);
        if (newSubtext === slideDetailData?.subtext) return;
        privateAxios
            .get(`presentation/updateSlide?slideId=${id ?? 0}&subtext=${newSubtext}`)
            .then((response) => {
                console.log(response);
                console.log(`subtext changed successfully for slide ${id}`);
                setSlideDetailData((curSlideDetailData) => {
                    return {
                        ...curSlideDetailData,
                        subtext: newSubtext
                    };
                });
                form.setFieldValue("subtext", newSubtext);
                return response;
            })
            .catch((error) => {
                console.log("get error");
                console.log(error);
            });
    };
    const debounceSlideSubTextChanged = useMemo(() => debounce(onSlideSubTextChanged, 1000), [id]);

    // option changed handlers
    const updateSlideDetailAndOptionsForm = (newOptionsList) => {
        setSlideDetailData((curSlideDetailData) => {
            return {
                ...curSlideDetailData,
                options: newOptionsList
            };
        });
        setValueForOptionList(newOptionsList);
    };
    const onChangeOptionText = async (optionIndex, newText, newIsCorrect) => {
        console.log(slideDetailData);
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
                updateSlideDetailAndOptionsForm(newOptionsList);
            })
            .catch((error) => {
                console.log("get error");
                console.log(error);
            });
    };
    const debounceOptionChanged = useMemo(
        () => debounce(onChangeOptionText, 1000),
        [slideDetailData]
    );

    const renderMainLabel = () => {
        const type = slideDetailData?.type ?? 0;
        if (type === 1) return "Title";
        if (type === 2) return "Header";
        return "Question";
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

    function renderSelecOption(type) {
        let text = "Multiple choice";
        if (type === 1) text = "Paragraph";
        else if (type === 2) text = "Heading";
        return (
            <div className="flex flex-row w-full h-full space-x-4 items-center">
                {renderIcon(type)}
                <p className="text-neutral-500 text-lg font-medium">{text}</p>
            </div>
        );
    }

    if (!slideDetailData) {
        return null;
    }
    console.log(slideDetailData);

    const onFormValuesChanged = (changedValues, allValues) => {
        console.log(changedValues);
        console.log(allValues);
        const changedField = Object.keys(changedValues)[0];
        if (changedField === "question") {
            debounceSlideQuestionOrTypeChanged(changedValues.question, slideDetailData?.type ?? 0);
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
        } else if (changedField === "type") {
            const newType = changedValues.type;
            onSlideQuestionOrTypeChanged(slideDetailData?.question, parseInt(newType, 10));
        } else if (changedField === "subtext") {
            debounceSlideSubTextChanged(changedValues.subtext);
        }
    };

    return (
        <div className="flex flex-row overflow-hidden bg-neutral-300 w-full sm:w-[80%] lg:w-[85%] xl:w-[90%]">
            <div className="grow flex flex-col justify-center items-center mx-5 my-10 bg-white">
                <p className="text-5xl text-slate-500 mb-5">
                    {slideDetailData?.question ?? "Question"}
                </p>
                {slideDetailData?.type === 0 ? (
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
                ) : (
                    <p className="text-xl max-w-[90%] text-slate-300 text-center break-all">
                        {slideDetailData?.subtext}
                    </p>
                )}
            </div>
            <div className="bg-white min-w-[440px] h-full overflow-auto px-5 pb-8">
                <Form
                    form={form}
                    layout="vertical"
                    className="mt-2"
                    onValuesChange={onFormValuesChanged}
                >
                    <Form.Item
                        name="type"
                        label={<p className="text-lg font-medium text-gray-700">Slide type</p>}
                    >
                        <Select size="large" placeholder="Please select a country">
                            <Select.Option value="0">{renderSelecOption(0)}</Select.Option>
                            <Select.Option value="1">{renderSelecOption(1)}</Select.Option>
                            <Select.Option value="2">{renderSelecOption(2)}</Select.Option>
                        </Select>
                    </Form.Item>
                    <div className="mt-4 pt-3 font-bold text-2xl text-center border-t border-t-neutral-300">
                        Content
                    </div>
                    <Form.Item
                        name="question"
                        className="mt-1 w-full"
                        label={
                            <p className="text-lg font-medium text-gray-700">{renderMainLabel()}</p>
                        }
                        initialValue=""
                    >
                        <input
                            name="question"
                            placeholder="Question/Title/Header"
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
                    {slideDetailData?.type === 0 ? (
                        <OptionForm
                            slideId={id}
                            listOptions={slideDetailData?.options ?? []}
                            parentUpdateAfterEditOptions={(newOptionsList) => {
                                updateSlideDetailAndOptionsForm(newOptionsList);
                            }}
                        />
                    ) : (
                        <Form.Item
                            name="subtext"
                            className="mt-1 w-full"
                            label={
                                <p className="text-lg font-medium text-gray-700">
                                    {slideDetailData?.type === 1 ? "Paragraph" : "sub header"}
                                </p>
                            }
                            initialValue=""
                        >
                            <textarea
                                name="subtext"
                                rows={5}
                                maxLength={500}
                                placeholder="Subtext"
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
                    )}
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
    parentSetSlideQuestion: PropTypes.func,
    renderIcon: PropTypes.func
};

PreviewResultAndEdit.defaultProps = {
    id: 0,
    parentSelectedIndex: 0,
    parentCurIndexView: 0,
    parentSetSelectedIndexView: null,
    parentSetSlideQuestion: null,
    renderIcon: null
};

export default PreviewResultAndEdit;
