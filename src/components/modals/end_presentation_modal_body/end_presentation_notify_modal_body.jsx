import { useNavigate } from "react-router-dom";

function EndPresentationNotifyModalBody() {
    const navigate = useNavigate();
    return (
        <div className=" bg-white rounded-md flex flex-col justify-center items-center">
            <p className="mt-1 break-words text-center text-md font-bold">
                Presentation session ended
            </p>
            <p className="mt-2 break-words text-center">
                This presentation session has been ended. Click &#8220;OK&#8221; to move to home
                page.
            </p>
            <button
                type="button"
                className="mt-3 px-3 py-1 rounded-md text-black text-md bg-white border border-gray-400"
                onClick={() => navigate("../", { replace: true })}
            >
                OK
            </button>
        </div>
    );
}

export default EndPresentationNotifyModalBody;
