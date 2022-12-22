import { useQuery } from "react-query";
import { ImSpinner10 } from "react-icons/im";
import { MdDone, MdError } from "react-icons/md";
import { useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { publicAxios } from "../../configs/networks/custom_axioses";
import AuthContext from "../../components/contexts/auth_context";

function ActiveAccountPage() {
    const { username } = useParams();
    const { setUser } = useContext(AuthContext);
    const callActivateAccountApi = async () => {
        const res = await publicAxios.get(`auth/active`, { params: { username } });
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
        refetch().then(() => {
            const userData = JSON.parse(localStorage.getItem("userData"));
            console.log(userData);
            setUser({ ...userData, active: 1 });
            localStorage.setItem("userData", JSON.stringify({ ...userData, active: 1 }));
        });
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
