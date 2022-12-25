import { Space, Table } from "antd";
import { AiOutlineLogin } from "react-icons/ai";
import { BsFillPlayFill } from "react-icons/bs";
import { RiEdit2Line, RiDeleteBin5Fill } from "react-icons/ri";
import PropTypes from "prop-types";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import PresentationCard from "../../components/cards/presentation_card";
import AuthContext from "../../components/contexts/auth_context";
import usePrivateAxios from "../../configs/networks/usePrivateAxios";
import { convertTimeStampToDate } from "../../utilities";

function TablePresentation({ dataList, onSelectPresentationRemove }) {
    const { user } = useContext(AuthContext);
    const privateAxios = usePrivateAxios();
    const navigate = useNavigate();
    const location = useLocation();

    async function onDeletePresentation(presentationId) {
        return privateAxios
            .get(`presentation/delete?presentationId=${presentationId}`)
            .then((response) => {
                console.log(response);
                if (location.pathname === "/") {
                    navigate(0);
                }
            });
    }

    function renderButton(btnType, isOwner, presentationId, presentationName) {
        const isDeleteBtn = btnType.toLocaleLowerCase() === "delete".toLocaleLowerCase();
        const isPresentBtn = btnType.toLocaleLowerCase() === "present".toLocaleLowerCase();
        if ((!isOwner && isDeleteBtn) || (!isOwner && isPresentBtn)) return null;
        const btnIconColor = `${isDeleteBtn ? "text-red-500" : "text-neutral-400"}`;
        const size = 24;

        function renderIcon() {
            let icon = null;
            switch (btnType.toLocaleLowerCase()) {
                case "join".toLocaleLowerCase(): {
                    icon = <AiOutlineLogin size={size} className={btnIconColor} />;
                    break;
                }
                case "edit".toLocaleLowerCase(): {
                    icon = <RiEdit2Line size={size} className={btnIconColor} />;
                    break;
                }
                case "delete".toLocaleLowerCase(): {
                    icon = <RiDeleteBin5Fill size={size} className={btnIconColor} />;
                    break;
                }
                default:
                    icon = <BsFillPlayFill size={size} className={btnIconColor} />;
                    break;
            }
            return icon;
        }

        return (
            <button
                type="button"
                className="rounded-full p-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                    if (btnType.toLocaleLowerCase() === "delete".toLocaleLowerCase()) {
                        onSelectPresentationRemove({
                            name: `presentation ${presentationName}`,
                            onConfirmRemove: async () => onDeletePresentation(presentationId)
                        });
                    } else if (btnType.toLocaleLowerCase() === "edit".toLocaleLowerCase()) {
                        navigate(`/presentation/${presentationId}/edit`);
                    }
                }}
            >
                {renderIcon()}
            </button>
        );
    }

    // function renderRows() {
    //     const rowToRender = [];
    //     const { length } = dataList;
    //     for (let index = 0; index < length; index += 1) {
    //         const { id, name, timeCreated } = dataList[index];
    //         rowToRender.push(
    //             <PresentationCard
    //                 key={`${name}_card`}
    //                 presentationId={`${id}`}
    //                 presentationName={name}
    //                 timeCreated={timeCreated}
    //                 userCanEdit
    //                 onRemoveBtnClick={onSelectPresentationRemove}
    //             />
    //         );
    //     }
    //     return rowToRender;
    // }

    function getColumn() {
        const column = [
            {
                title: "Name",
                dataIndex: "name",
                key: "name"
            },
            {
                title: "Owner",
                dataIndex: "creator",
                key: "creator",
                render: (_, record) => (
                    <p className="text-lg text-gray-500 break-words">
                        {record.creator.username === user?.username
                            ? "me"
                            : record.creator.displayName}
                    </p>
                )
            },
            {
                title: "Created at",
                dataIndex: "timeCreated",
                key: "timeCreated",
                render: (_, record) => (
                    <p className="text-lg text-gray-500 break-words">
                        {convertTimeStampToDate({
                            date: new Date(record.timeCreated),
                            showTime: true
                        })}
                    </p>
                )
            },
            {
                title: "Action",
                key: "action",
                render: (_, record) => (
                    <Space size="small">
                        {renderButton(
                            "present",
                            record.creator.username === user.username,
                            record.id,
                            record.name
                        )}
                        {renderButton(
                            "edit",
                            record.creator.username === user.username,
                            record.id,
                            record.name
                        )}
                        {renderButton(
                            "delete",
                            record.creator.username === user.username,
                            record.id,
                            record.name
                        )}
                    </Space>
                )
            }
        ];

        return column;
    }
    function getDataSource() {
        const dataSource = [];
        const { length } = dataList;
        for (let index = 0; index < length; index += 1) {
            const { id, name, creator, timeCreated } = dataList[index];
            dataSource.push({
                key: `presentation_${id}`,
                id,
                name: `${name}`,
                creator: { ...creator },
                timeCreated
            });
        }
        return dataSource;
    }

    return <Table dataSource={getDataSource()} columns={getColumn()} />;
}

TablePresentation.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    dataList: PropTypes.array,
    onSelectPresentationRemove: PropTypes.func
};
TablePresentation.defaultProps = {
    dataList: [],
    onSelectPresentationRemove: null
};

export default TablePresentation;
