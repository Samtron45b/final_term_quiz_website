import React from "react";
import PropTypes from "prop-types";

function SimpleMenuBar({ viewIndex, setViewIndex, listItem }) {
    function renderMenuItem() {
        const listToRender = [];
        const { length } = listItem;
        for (let index = 0; index < length; index += 1) {
            const { text, icon } = listItem[index];
            const color = `text-${viewIndex === index ? "purple-600" : "gray-500"}`;
            // const borderColor = `border-${viewIndex === index ? "purple-700" : "transparent"}`;
            // const borderHoverColor = `border-${
            //     viewIndex === index ? "transparent" : "neutral-400"
            // }`;
            listToRender.push(
                <li
                    key={`simple_menu_bar_${icon.name}`}
                    className="flex items-center p-2 text-base font-normal text-gray-900 rounded-r-md dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                        if (viewIndex !== index) {
                            setViewIndex(index);
                        }
                    }}
                    aria-hidden="true"
                >
                    {icon({
                        size: 24,
                        className: color
                    })}
                    <span className={`flex-1 ml-3 whitespace-nowrap ${color}`}>{text}</span>
                </li>
            );
        }
        return listToRender;
    }
    return <ul className="space-y-2 mt-1">{renderMenuItem()}</ul>;
}

SimpleMenuBar.propTypes = {
    viewIndex: PropTypes.number.isRequired,
    setViewIndex: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    listItem: PropTypes.array.isRequired
};

export default SimpleMenuBar;
