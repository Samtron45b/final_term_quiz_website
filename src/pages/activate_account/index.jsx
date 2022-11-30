import axios from "axios";
import { useQuery } from "react-query";
import { ImSpinner10 } from "react-icons/im";
import { MdDone, MdError } from "react-icons/md";
import { useEffect } from "react";

function ActiveAccountPage() {
    useEffect(() =>
        axios.get(
            // eslint-disable-next-line react/destructuring-assignment, react/no-this-in-sfc
            `http://localhost:5000/user/active?username=${this.props.match.params.username}`
        )
    );

    const callActivateAccountApi = async () => {
        const res = await axios.get("https://api.quotable.io/random");
        return res.data;
    };

    const { data, error, isLoading } = useQuery("randomQuotes", callActivateAccountApi, {
        refetchInterval: 6000
    });

    function renderIcon() {
        const size = 100;
        if (isLoading) return <ImSpinner10 size={size} className="animate-spin mr-3 mb-2" />;
        if (error) return <MdError size={size} className="text-red-500 mr-3 mb-2" />;
        return <MdDone size={size} className="text-green-400 mr-3 mb-2" />;
    }

    function getMessage() {
        if (isLoading) return "Activating...";
        if (error) return `${error}`;
        return `${data?.content}`;
    }

    return (
        <div className="flex flex-col items-center pt-20 px-20 w-full">
            {renderIcon()}
            {getMessage()}
        </div>
    );
}

export default ActiveAccountPage;
