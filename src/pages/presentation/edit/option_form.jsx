import PropTypes from "prop-types";
import { Form } from "antd";
import { RiCloseFill } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import usePrivateAxios from "../../../configs/networks/usePrivateAxios";

function OptionForm({
    slideId,
    fieldname,
    listOptions,
    parentUpdateAfterEditOptions,
    parentUpdateDebounceOptionList,
    updateSavingStatus
}) {
    const form = Form.useFormInstance();
    console.log("form list field:", form.getFieldsValue(fieldname));

    const privateAxios = usePrivateAxios();

    const onAddOption = async () => {
        updateSavingStatus(true);
        privateAxios
            .get(
                `presentation/addOption?slideId=${slideId ?? 0}&optionText=Answer ${
                    listOptions.length + 1
                }&isCorrect=${false}`
            )
            .then((response) => {
                console.log(response);
                console.log(`add option successfully for slide ${slideId}`);
                const newOptionsList = listOptions.map((option, index) => {
                    return {
                        ...option,
                        optionText: Object.values(form.getFieldValue(fieldname)[index])[0]
                    };
                });
                parentUpdateAfterEditOptions(
                    newOptionsList.concat([
                        {
                            id: response?.data?.id ?? 0,
                            slideId,
                            optionText: response?.data?.optionText ?? "",
                            isCorrect: response?.data?.isCorrect ?? false,
                            answerAmount: response?.data?.answerAmount ?? 0
                        }
                    ])
                );
                parentUpdateDebounceOptionList(1);
                return response;
            })
            .catch((error) => {
                console.log("get error");
                console.log(error);
            })
            .finally(() => updateSavingStatus(false));
    };

    const onDeleteOption = async (optionId) => {
        updateSavingStatus(true);
        const newOptionsList = listOptions.flatMap((option, index) => {
            if (option.id === optionId) {
                parentUpdateDebounceOptionList(-1, null, index);
                return [];
            }
            return [
                {
                    ...option,
                    optionText: Object.values(form.getFieldValue(fieldname)[index])[0]
                }
            ];
        });
        parentUpdateAfterEditOptions(newOptionsList);
        return privateAxios
            .get(`presentation/deleteOption?optionId=${optionId}`)
            .then((response) => {
                console.log(response);
                console.log(`delete option ${optionId} successfully for slide ${slideId}`);
            })
            .catch((error) => {
                console.log("get error");
                console.log(error);
            })
            .finally(() => updateSavingStatus(false));
    };

    return (
        <Form.List name={fieldname ?? `slide${slideId}_options`}>
            {(fieldNameHead) => (
                <>
                    <span className="text-lg font-medium text-gray-700">Options</span>
                    <button
                        type="button"
                        className="bg-purple-700 hover:bg-purple-500 opacity-70 w-full flex justify-center items-center px-2 py-3 rounded-md text-white font-medium"
                        onClick={async () => {
                            onAddOption();
                        }}
                    >
                        <IoMdAdd size={20} className="mr-1" />
                        Add options
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
                                        onDeleteOption(listOptions[index]?.id ?? 0);
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

OptionForm.propTypes = {
    slideId: PropTypes.number,
    fieldname: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    listOptions: PropTypes.array,
    parentUpdateAfterEditOptions: PropTypes.func,
    parentUpdateDebounceOptionList: PropTypes.func,
    updateSavingStatus: PropTypes.func
};

OptionForm.defaultProps = {
    slideId: 0,
    fieldname: "",
    listOptions: [],
    parentUpdateAfterEditOptions: null,
    parentUpdateDebounceOptionList: null,
    updateSavingStatus: null
};

export default OptionForm;
