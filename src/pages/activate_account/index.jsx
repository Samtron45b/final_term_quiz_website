import axios from "axios";
import { useQuery } from "react-query";
import { ImSpinner10 } from "react-icons/im";
import { MdDone, MdError } from "react-icons/md";
import { useParams } from "react-router-dom";

function ActiveAccountPage() {
    const { username } = useParams();
    console.log(username);
    const callActivateAccountApi = async () => {
        const res = await axios.get(
            `https://45d6-2402-800-63b6-df31-61e7-55fc-79cc-bfa1.ap.ngrok.io/user/active?username=${username}`
        );
        return res.data;
    };

    const { data, error, isLoading } = useQuery("active_account_request", callActivateAccountApi);

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
