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
    renderIcon,
    updateSavingStatus
}) {
    const [slideDetailData, setSlideDetailData] = useState(null);
    const [debounceOptionList, setDebounceOptionList] = useState([]);
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

    const optionField = `slide${id}_options`;

    function setValueForOptionList(listOptions) {
        console.log(listOptions);
        const currentOptionMap = listOptions.map((option) => {
            return Object.fromEntries(new Map([[`${option.id}`, option.optionText]]));
        });
        form.setFieldValue(optionField, currentOptionMap);
    }

    // question (also header or title) or type or subtext changed handler
    const checkIfQuestionTypeSubtextNotChanged = (newQuestion, newType, newSubtext) => {
        return (
            (newQuestion === undefined ||
                (newQuestion !== undefined && newQuestion === slideDetailData?.question)) &&
            (newType === undefined ||
                (newType !== undefined && newType === slideDetailData?.type)) &&
            (newSubtext === undefined ||
                (newSubtext !== undefined && newSubtext === slideDetailData?.subtext))
        );
    };
    const changeQuestionOrTypeOrSubtext = async ({ newQuestion, newType, newSubtext }) => {
        console.log("console.log from debounce (question)");
        console.log(newQuestion, newType);
        // check if there is no changes
        if (checkIfQuestionTypeSubtextNotChanged(newQuestion, newType, newSubtext)) return;

        updateSavingStatus(true);
        if (newQuestion !== undefined) {
            setSlideDetailData((curSlideDetailData) => {
                return { ...curSlideDetailData, question: newQuestion };
            });
            parentSetSlideQuestion?.(id, newQuestion, newType);
        }
        if (newType !== undefined) {
            setSlideDetailData((curSlideDetailData) => {
                return { ...curSlideDetailData, type: newType };
            });
            parentSetSlideQuestion?.(id, newQuestion, newType);
        }
        if (newSubtext !== undefined) {
            setSlideDetailData((curSlideDetailData) => {
                return { ...curSlideDetailData, subtext: newSubtext };
            });
        }

        privateAxios
            .get(`presentation/updateSlide`, {
                params: {
                    slideId: id,
                    question: newQuestion ?? undefined,
                    type: newType ?? undefined,
                    subtext: newSubtext ?? undefined
                }
            })
            .then((response) => {
                console.log(response);
                console.log(`question or type or subtext changed successfully for slide ${id}`);
                return response;
            })
            .catch((error) => {
                console.log("get error");
                console.log(error);
            })
            .finally(() => updateSavingStatus(false));
    };
    const onSlideTypeChanged = (newType) => {
        changeQuestionOrTypeOrSubtext({ newType });
    };
    const onSlideQuestionChanged = (newQuestion) => {
        changeQuestionOrTypeOrSubtext({ newQuestion });
    };
    const onSlideSubtextChanged = (newSubtext) => {
        changeQuestionOrTypeOrSubtext({ newSubtext });
    };
    const debounceSlideQuestionChanged = useMemo(
        () => debounce(onSlideQuestionChanged, 1000),
        [id]
    );
    const debounceSlideSubtextChanged = useMemo(() => debounce(onSlideSubtextChanged, 1000), [id]);

    // option changed handlers
    const updateSlideDetailAndOptionsForm = (newOptionsList, noUpdateForm) => {
        console.log("newList", newOptionsList);
        setSlideDetailData((curSlideDetailData) => {
            return { ...curSlideDetailData, options: newOptionsList };
        });
        if (!noUpdateForm) setValueForOptionList(newOptionsList);
    };
    const onChangeOptionText = async (optionId, newText, newIsCorrect) => {
        const finalNewText = newText;
        const finalIsCorrect = newIsCorrect;
        console.log(optionId, finalNewText, finalIsCorrect);
        updateSavingStatus(true);
        setSlideDetailData((curSlideDetailData) => {
            console.log("curSlideDetailData", curSlideDetailData);
            const newOptionsList = curSlideDetailData.options.flatMap((option, index) => {
                if (!option) return [];
                if (option.id === optionId) {
                    return [
                        {
                            id: optionId,
                            slideId: id,
                            optionText: finalNewText ?? "",
                            isCorrect: finalIsCorrect ?? false,
                            answerAmount: option.answerAmount
                        }
                    ];
                }
                if (!form.getFieldValue(optionField)[index]) return [];
                console.log(Object.values(form.getFieldValue(optionField)[index]));
                return [
                    {
                        ...option,
                        optionText: Object.values(form.getFieldValue(optionField)[index])[0]
                    }
                ];
            });
            return { ...curSlideDetailData, options: newOptionsList };
        });
        // updateSlideDetailAndOptionsForm(newOptionsList, true);
        privateAxios
            .get(`presentation/updateOption`, {
                params: { optionId, optionText: finalNewText, isCorrect: finalIsCorrect }
            })
            .then((response) => {
                console.log(response);
                console.log(`update option ${optionId} successfully for slide ${id}`);
            })
            .catch((error) => {
                console.log("get error");
                console.log(error);
            })
            .finally(() => updateSavingStatus(false));
    };
    const updateDebounceOptionList = (updateType, optionList, index) => {
        if (updateType === 0) {
            setDebounceOptionList(() => {
                return optionList.map(() => {
                    return debounce(onChangeOptionText, 1000);
                });
            });
        } else if (updateType === 1) {
            setDebounceOptionList((curDebounceList) => {
                return curDebounceList.concat([debounce(onChangeOptionText, 1000)]);
            });
        } else if (updateType === -1) {
            setDebounceOptionList((curDebounceList) => {
                const { length } = curDebounceList;
                const newDebounceList = [];
                for (let i = 0; i < length; i += 1) {
                    const debounceOption = curDebounceList[i];
                    if (i === index) {
                        debounceOption.cancel();
                    } else {
                        newDebounceList.push(debounceOption);
                    }
                }
                return newDebounceList.concat([]);
            });
        }
    };

    const cleanUp = () => {
        debounceSlideQuestionChanged.cancel();
        debounceSlideSubtextChanged.cancel();
        console.log("debounce option amount", debounceOptionList);
        setDebounceOptionList((currentDebounceOptionList) => {
            currentDebounceOptionList.forEach((debounceOption) => {
                console.log("flushing");
                debounceOption.cancel();
            });
            return [];
        });
    };

    useEffect(() => {
        async function fectchData() {
            await slideQueryRefetch().then((response) => {
                form.setFieldValue("question", response?.data?.data?.question ?? "");
                form.setFieldValue("type", `${response?.data?.data?.type ?? 0}`);
                form.setFieldValue("subtext", response?.data?.data?.subtext ?? "");
                setValueForOptionList(response?.data?.data?.options ?? []);
                updateDebounceOptionList(0, response?.data?.data?.options ?? []);
            });
            if (!isSlideQueryFecthcing && parentCurIndexView !== parentSelectedIndex) {
                parentSetSelectedIndexView(parentCurIndexView);
            }
        }
        fectchData();
        return () => cleanUp();
    }, [id]);

    console.log("debounce option list:", debounceOptionList);

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
            debounceSlideQuestionChanged(changedValues.question);
        } else if (changedField === optionField) {
            const listOptions = changedValues[optionField] ?? [];
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
            debounceOptionList[optionIndex](
                Object.entries(changedOption)[0][0],
                Object.entries(changedOption)[0][1]
            );
        } else if (changedField === "type") {
            const newType = changedValues.type;
            onSlideTypeChanged(parseInt(newType, 10));
        } else if (changedField === "subtext") {
            debounceSlideSubtextChanged(changedValues.subtext);
        }
    };

    return (
        <div className="flex flex-row overflow-hidden bg-neutral-300 w-full sm:w-[80%] lg:w-[85%] xl:w-[90%]">
            <div className="flex-auto flex flex-col justify-center items-center py-1 mx-5 my-7 bg-white overflow-hidden">
                <p className="mb-3 pt-1 pb-2 w-[90%] max-h-[15%] text-3xl leading-none text-slate-500 overflow-hidden text-center break-words">
                    {slideDetailData?.question ?? "Question"}
                </p>
                {slideDetailData?.type === 0 ? (
                    <ResponsiveContainer width="70%" className="max-h-[80%]">
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
            <div className="flex-none bg-white min-w-[440px] h-full overflow-auto px-5 pb-8">
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
                            fieldname={optionField}
                            listOptions={slideDetailData?.options ?? []}
                            parentUpdateAfterEditOptions={(newOptionsList) => {
                                updateSlideDetailAndOptionsForm(newOptionsList);
                            }}
                            parentUpdateDebounceOptionList={updateDebounceOptionList}
                            updateSavingStatus={updateSavingStatus}
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
    renderIcon: PropTypes.func,
    updateSavingStatus: PropTypes.func
};

PreviewResultAndEdit.defaultProps = {
    id: 0,
    parentSelectedIndex: 0,
    parentCurIndexView: 0,
    parentSetSelectedIndexView: null,
    parentSetSlideQuestion: null,
    renderIcon: null,
    updateSavingStatus: null
};

export default PreviewResultAndEdit;
