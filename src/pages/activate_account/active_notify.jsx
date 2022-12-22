import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../components/contexts/auth_context";
import usePrivateAxios from "../../configs/networks/usePrivateAxios";

function ActiveNotifyPage() {
    const { username } = useParams();
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const privateAxios = usePrivateAxios();
    const onResendMailClick = async () => {
        const res = await privateAxios.get(`auth/active`, { params: { username } });
        console.log(res.data);
    };

    async function signout() {
        console.log(user.clientId);
        privateAxios
            .get(`user/logout?clientId=${user.clientId}`)
            .then(() => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("userData");
                setUser(null);
                navigate("/login", { replace: true });
            })
            .catch((err) => console.log(err));
    }

    return (
        <div className="flex flex-col items-center pt-5 px-20 w-full">
            <div className="flex flex-row justify-end w-full">
                <p className="text-red-500 cursor-pointer" onClick={() => signout()} aria-hidden>
                    Sign out
                </p>
            </div>
            <h1 className="text-4xl text-purple-500 mt-10">Account activate needed</h1>
            <p className="break-words">
                Your account is not activated yet. Please access to the link sent to the email
                linked to this account to activate it.
                <br />
                <b>Note:</b> If you don&#39;t see any mail, please check the spam box or click{" "}
                <span
                    className="hover:underline hover:decoration-2 font-bold text-purple-500 cursor-pointer"
                    onClick={() => onResendMailClick()}
                    aria-hidden
                >
                    resend
                </span>
            </p>
        </div>
    );
}

export default ActiveNotifyPage;
