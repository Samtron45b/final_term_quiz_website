import { Radio, Space } from "antd";
import PropTypes from "prop-types";
import { ImSpinner10 } from "react-icons/im";
import { useState } from "react";
import usePrivateAxios from "../../../configs/networks/usePrivateAxios";

function SelectOptionsField({ optionsList }) {
    const [selectedOption, setSelectedOption] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const privateAxios = usePrivateAxios();

    const submitOption = async () => {
        console.log("optionId", selectedOption?.target.value);
        privateAxios
            .get(`session/option/choose?optionId=${selectedOption?.target.value}`)
            .then((response) => {
                console.log("submit choice result:", response);
            })
            .catch((error) => {
                console.log("error on submit chocie", error);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <>
            <div className="px-2 py-3 w-[95%] h-[80%] overflow-x-hidden overflow-y-auto break-words rounded-md shadow-lg shadow-purple-300 bg-white">
                <p className="font-bold text-lg mb-1">Select your option</p>
                <Radio.Group className="w-full" onChange={(option) => setSelectedOption(option)}>
                    <Space direction="vertical" className="w-full">
                        {optionsList.map((option) => {
                            return (
                                <div
                                    key={option.id}
                                    className="px-3 py-3 w-full text-lg text-neutral-400 font-medium border-2 border-neutral-400 rounded-xl"
                                >
                                    <Radio value={option.id}>{option.optionText}</Radio>
                                </div>
                            );
                        })}
                    </Space>
                </Radio.Group>
            </div>
            <button
                type="button"
                onClick={() => {
                    if (isSubmitting) return;
                    if (selectedOption === null) return;
                    setIsSubmitting(true);
                    submitOption();
                }}
                className="w-[95%] py-[10px] mt-3 rounded-3xl bg-purple-500 text-white text-lg font-medium"
            >
                {isSubmitting ? (
                    <div className="flex justify-center items-center">
                        <ImSpinner10 className="animate-spin h-5 w-5 mr-3" />
                        Submitting...
                    </div>
                ) : (
                    "Submit"
                )}
            </button>
        </>
    );
}

SelectOptionsField.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    optionsList: PropTypes.array
};
SelectOptionsField.defaultProps = {
    optionsList: []
};

export default SelectOptionsField;
