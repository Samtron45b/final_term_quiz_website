import { useQuery } from "react-query";
import { ImSpinner10 } from "react-icons/im";
import { MdDone, MdError } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import AuthContext from "../../components/contexts/auth_context";
import usePrivateAxios from "../../configs/networks/usePrivateAxios";

function InviteGroupPage() {
    const { locationInvite, inviteId } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const privateAxios = usePrivateAxios();
    const callAddUserApi = async () => {
        const res = await privateAxios
            .get(`${locationInvite}/addUser`, { params: { inviteId, username: user.username } })
            .then((response) => {
                console.log(response);
                if (locationInvite === "group") {
                    navigate(`/group_detail/${response?.data?.data}`, { replace: true });
                }
            });
        return res.data;
    };

    const { data, error, isLoading, refetch } = useQuery("join_group_request", callAddUserApi, {
        enabled: false
    });

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
        if (isLoading) return "Processing...";
        if (error) return `${error.response.data.error}`;
        return `${data?.data}`;
    }

    return (
        <div className="flex flex-col items-center pt-20 px-20 w-full">
            {renderIcon()}
            {getMessage()}
        </div>
    );
}

export default InviteGroupPage;
