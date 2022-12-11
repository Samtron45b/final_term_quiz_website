import PropTypes from "prop-types";

// eslint-disable-next-line import/prefer-default-export
export const convertTimeStampToDate = ({ date, showWeekDay, showTime }) => {
    const formatted = new Intl.DateTimeFormat("en-UK", {
        weekday: showWeekDay ? "narrow" : undefined,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: showTime ? "2-digit" : undefined,
        minute: showTime ? "2-digit" : undefined,
        second: showTime ? "2-digit" : undefined
    }).format(date);

    // const formatted = `${t.toString().split(" ")[0]}
    //     + ' ' + ${`0${t.getDate()}`.slice(-2)}
    //     + '/' + ${`0${t.getMonth() + 1}`.slice(-2)}
    //     + '/' + ${t.getFullYear()}
    //     + ' - ' + ${`0${t.getHours()}`.slice(-2)}
    //     + ':' + ${`0${t.getMinutes()}`.slice(-2)}`;

    return formatted;
};

convertTimeStampToDate.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    date: PropTypes.object,
    showWeekDay: PropTypes.bool,
    showTime: PropTypes.bool
};
convertTimeStampToDate.defaultProps = {
    // eslint-disable-next-line react/forbid-prop-types
    date: Date.now(),
    showWeekDay: false,
    showTime: false
};
