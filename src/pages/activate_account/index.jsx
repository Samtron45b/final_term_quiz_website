import axios from "axios";
import { useQuery } from "react-query";
import { ImSpinner10 } from "react-icons/im";
import { MdDone, MdError } from "react-icons/md";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

function ActiveAccountPage() {
    const { username } = useParams();
    const callActivateAccountApi = async () => {
        const res = await axios.get(
            `${process.env.REACT_APP_BASE_URL}user/active?username=${username}`
        );
        return res.data;
    };

    const { data, error, isLoading, refetch } = useQuery(
        "active_account_request",
        callActivateAccountApi,
        {
            enabled: false
        }
    );

    useEffect(() => {
        refetch();
    }, []);

    function renderIcon() {
        const size = 100;
        if (isLoading) return <ImSpinner10 size={size} className="animate-spin mr-3 mb-2" />;
        if (error) return <MdError size={size} className="text-red-500 mr-3 mb-2" />;
        return <MdDone size={size} className="text-green-400 mr-3 mb-2" />;
    }

    function getMessage() {
        if (isLoading) return "Activating...";
        if (error) return `${error}`;
        return `${data?.data}`;
    }

    return (
        <div className="flex flex-col items-center pt-20 px-20 w-full">
            {renderIcon()}
            {getMessage()}
        </div>
    );
}

export default ActiveAccountPage;
