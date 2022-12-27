import { useContext, useEffect, useMemo, useState } from "react";
import { GiSpinningSword } from "react-icons/gi";
import { MdDone } from "react-icons/md";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { Form } from "antd";
import debounce from "lodash/debounce";
import MainHeader from "../../../components/header/main_header/main_header";
import PreviewResult from "../edit/preview_result_and_edit";
import PresentationSingleSlideThumbNail from "../edit/single_slide_thumbnail";
import usePrivateAxios from "../../../configs/networks/usePrivateAxios";
import ActionButton from "../edit/action_btns";
import AuthContext from "../../../components/contexts/auth_context";
import ModalFrame from "../../../components/modals/modal_frame";
import RemoveModalBody from "../../../components/modals/remove_modal_body";
import PresentationCollabModalBody from "../../../components/modals/presentation_collaborator_modal_body";
import QuestionChatBtn from "./question_chat_btn";

function PresentationPresentPage() {
    const { user } = useContext(AuthContext);
    const { presentationId } = useParams();
    const [savingList, setSavingList] = useState([]);
    const [selectedIndexView, setSelectedIndexView] = useState(0);
    const [curIndexView, setCurIndexView] = useState(0);
    const [isGetPresentationError, setIsGetPresentationError] = useState(false);
    const [presentationData, setPresentationData] = useState(null);
    const [collaboratorsData, setCollaboratorsData] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [showCollabModal, setShowCollabModal] = useState(false);
    const [objectToRemove, setObjectToRemove] = useState(null);
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const privateAxios = usePrivateAxios();

    const { refetch: presentationQueryRefetch } = useQuery({
        queryKey: ["get_presentation_present_data"],
        enabled: false,
        queryFn: async () => {
            return privateAxios
                .get(`presentation/get?presentationId=${presentationId}`)
                .then((response) => {
                    console.log("Presentation data", response);
                    setPresentationData({ ...response?.data });
                    form.setFieldValue("presentationName", response?.data?.name);
                    setIsOwner(response?.data?.creator?.username === user.username);
                    return response;
                })
                .catch((error) => {
                    console.log("get error");
                    console.log(error);
                    setPresentationData({});
                    setIsGetPresentationError(true);
                });
        }
    });

    const { refetch: collaboratorsQueryRefetch } = useQuery({
        queryKey: ["get_presentation_collaborators"],
        enabled: false,
        queryFn: async () => {
            return privateAxios
                .get(`presentation/getCollaborator?presentationId=${presentationId}`)
                .then((response) => {
                    console.log("Collaborators data", response);
                    setCollaboratorsData(response?.data?.concat([]));
                    return response;
                })
                .catch((error) => {
                    console.log("get error");
                    console.log(error);
                });
        }
    });

    const afterRemoveCollaborator = (removedCollaboratorName) => {
        setCollaboratorsData((currentCollaboratorsList) => {
            const newCollaboratorsList = (currentCollaboratorsList ?? []).filter((collaborator) => {
                return collaborator.username !== removedCollaboratorName;
            });
            return newCollaboratorsList.concat([]);
        });
        setObjectToRemove(null);
    };

    const updateSavingList = (isIncrease) => {
        if (!isIncrease) {
            setSavingList((currentSavingList) => currentSavingList.slice(0, -1));
            return;
        }
        setSavingList((currentSavingList) => currentSavingList.concat([currentSavingList.length]));
    };

    async function changeName(newName) {
        let finalNewName = newName.trim();
        if (finalNewName === "") {
            finalNewName = `Untitled_presentation_${presentationData?.timeCreated}`;
        }
        updateSavingList(true);
        privateAxios
            .get(
                `presentation/update?presentationId=${
                    presentationData?.id ?? 0
                }&name=${finalNewName}`
            )
            .then((response) => {
                console.log(response);
                console.log("name changed successfully");
                setPresentationData((curPresentationData) => {
                    return {
                        ...curPresentationData,
                        name: newName
                    };
                });
                return response;
            })
            .catch((error) => {
                console.log("get error");
                console.log(error);
            })
            .finally(() => {
                updateSavingList(false);
            });
    }

    const onPresentationNameChanged = async (newName) => {
        console.log("console.log from debounce");
        console.log(newName);
        changeName(newName);
    };
    const debouncePresentatioNnameChanged = useMemo(
        () => debounce(onPresentationNameChanged, 1000),
        [presentationData?.id]
    );

    const updateSlideThumbnail = (slideId, newText, newType) => {
        setPresentationData((curPresentationData) => {
            return {
                ...curPresentationData,
                slides: (curPresentationData?.slides ?? []).map((slide) => {
                    if (slideId === slide.id) {
                        if (newText !== undefined) {
                            return { ...slide, question: newText };
                        }
                        if (newType !== undefined) return { ...slide, type: newType };
                    }
                    return { ...slide };
                })
            };
        });
    };

    const afterAddSlide = (newSlideData) => {
        setPresentationData((curPresentationData) => {
            return {
                ...curPresentationData,
                slides: (curPresentationData?.slides ?? []).concat([
                    {
                        id: newSlideData.id,
                        presentationId: newSlideData.presentationId,
                        question: newSlideData.question
                    }
                ])
            };
        });
    };

    useEffect(() => {
        console.log(presentationId);
        presentationQueryRefetch();
        collaboratorsQueryRefetch();
        return () => {
            console.log("Removing cache from presentation present", presentationId);
            queryClient.removeQueries({ queryKey: ["get_presentation_present_data"], exact: true });
            queryClient.removeQueries({
                queryKey: ["get_presentation_collaborators"],
                exact: true
            });
            queryClient.removeQueries({ queryKey: ["get_slide_detail"], exact: true });
            setIsGetPresentationError(false);
        };
    }, [presentationId]);

    function renderSavingStatus() {
        const size = 24;
        let icon = <MdDone size={size} className="text-green-400 mr-1" />;
        let text = <p>Saved</p>;
        if (savingList.length > 0) {
            icon = <GiSpinningSword size={size} className="animate-spin text-blue-400 mr-1" />;
            text = <p className="text-neutral-400">Saving...</p>;
        }
        return (
            <div className="flex flex-row justify-center items-center mr-3 p-2">
                {icon}
                {text}
            </div>
        );
    }

    function renderIconBaseOnType(type, size) {
        if (type === 1) {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    preserveAspectRatio="xMidYMid meet"
                    width={`${size ?? 28}`}
                    height={`${size ?? 28}`}
                    viewBox="0 0 48 48"
                >
                    <title>Heading Paragraph Icon</title>
                    <rect
                        fill="rgb(183, 186, 194)"
                        x="3.93"
                        y="11.04"
                        width="40.92"
                        height="8.66"
                        rx="1.26"
                    />
                    <rect fill="rgb(64, 70, 93)" y="22.31" width="48" height="13.38" rx="1.26" />
                </svg>
            );
        }
        if (type === 2) {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    preserveAspectRatio="xMidYMid meet"
                    width={`${size ?? 28}`}
                    height={`${size ?? 28}`}
                    viewBox="0 0 48 48"
                >
                    <title>Heading Subheading Icon</title>
                    <rect fill="rgb(64, 70, 93)" y="18.05" width="48" height="10.15" rx="1.26" />
                    <rect
                        fill="rgb(183, 186, 194)"
                        x="5.54"
                        y="30.05"
                        width="36.92"
                        height="4.62"
                        rx="1.3"
                    />
                </svg>
            );
        }

        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                preserveAspectRatio="xMidYMid meet"
                width={`${size ?? 28}`}
                height={`${size ?? 28}`}
                viewBox="0 0 48 48"
            >
                <title>Bar Chart Icon</title>
                <rect x="32.73" y="17.04" width="11.4" height="25.25" fill="rgb(231, 232, 235)" />
                <rect x="3.87" y="26.22" width="11.4" height="16.06" fill="rgb(64, 70, 93)" />
                <rect x="18.3" y="4.31" width="11.4" height="37.97" fill="rgb(183, 186, 194)" />
                <rect y="42.28" width="48" height=".99" fill="#000000" />
            </svg>
        );
    }

    function renderSlideThumbnails() {
        const listSlideThumbnails = [];
        const slideList = presentationData?.slides ?? [];
        const { length } = slideList;
        const updateSlideListAfterRemoveSlide = (slideId) => {
            const currentSlideList = presentationData?.slides?.concat() ?? [];
            const slideIdIndex = currentSlideList.findIndex((slide) => slide.id === slideId);
            const newSlideList = currentSlideList.filter((slide) => slide.id !== slideId);
            console.log(slideId, currentSlideList, slideIdIndex, curIndexView, newSlideList);
            if (slideIdIndex === curIndexView && slideIdIndex === currentSlideList.length - 1) {
                setCurIndexView(newSlideList.length - 1);
            }
            setPresentationData((curPresentationData) => {
                return {
                    ...curPresentationData,
                    slides: newSlideList
                };
            });
            setObjectToRemove(null);
        };
        for (let i = 0; i < length; i += 1) {
            listSlideThumbnails.push(
                <PresentationSingleSlideThumbNail
                    key={`${slideList[i].id}`}
                    isSelected={i === selectedIndexView}
                    canBeDeleted={length > 1}
                    id={slideList[i].id}
                    index={i}
                    icon={renderIconBaseOnType(slideList[i].type, 50)}
                    question={slideList[i].question}
                    onClick={() => setCurIndexView(i)}
                    updateListSlide={updateSlideListAfterRemoveSlide}
                    updateSavingStatus={updateSavingList}
                    updateObjectToRemove={(slideToRemove) => setObjectToRemove(slideToRemove)}
                />
            );
        }
        return listSlideThumbnails;
    }

    if (!presentationData || !collaboratorsData) {
        return null;
    }

    console.log("presentationData ", presentationData);

    function renderMainChildren() {
        if (isGetPresentationError) {
            return (
                <p className="mt-10 text-center w-full text-neutral-400 text-3xl">
                    Cannot get data for this presentation.
                </p>
            );
        }

        if (user.username !== presentationData?.creator?.username) {
            const userInList = collaboratorsData?.find((collaborator) => {
                return collaborator.username === user.username;
            });
            if (!userInList) {
                return (
                    <p className="mt-10 text-center w-full text-neutral-400 text-3xl">
                        You cannot not access this presentation.
                    </p>
                );
            }
        }

        return (
            <>
                <div className="flex flex-row items-center justify-between bg-white mt-[-2px] py-2 pl-8 pr-2 border-b-[0.5px] border-b-neutral-500">
                    <Form
                        form={form}
                        layout="inline"
                        className="w-[30%]"
                        onValuesChange={(changedValues) => {
                            debouncePresentatioNnameChanged(changedValues.presentationName);
                        }}
                    >
                        <Form.Item name="presentationName" className="mt-1 w-full" initialValue="">
                            <input
                                name="presentationName"
                                placeholder="Presentation name"
                                className="
                                    focus:ring-purple-600 focus:border-purple-500
                                    focus:shadow-purple-300
                                    focus:shadow-inner
                                    focus:outline-none hover:border-purple-400
                                    block w-full sm:text-sm border-gray-300
                                    px-2 py-3 bg-white border rounded-md "
                            />
                        </Form.Item>
                    </Form>
                    <div className="flex">
                        {renderSavingStatus()}
                        <ActionButton
                            presentationId={presentationData?.id}
                            presentationName={presentationData?.name}
                            isOwner={isOwner}
                            parentAfterAddSlide={afterAddSlide}
                            parentUpdateSavingStatus={updateSavingList}
                            onCollabBtnClick={() => setShowCollabModal(true)}
                            onDeleteBtnClick={(objectSelected) => setObjectToRemove(objectSelected)}
                        />
                    </div>
                </div>
                <div className="flex flex-row w-full max-h-full h-screen overflow-hidden">
                    <div
                        id="presentation_thumbnail_list"
                        className="h-full overflow-auto sm:w-[20%] lg:w-[15%] xl:w-[12.5%] 2xl:w-[11%] text-cyan-200"
                    >
                        {renderSlideThumbnails()}
                    </div>
                    <PreviewResult
                        id={presentationData?.slides?.[curIndexView]?.id ?? 0}
                        parentSelectedIndex={selectedIndexView}
                        parentCurIndexView={curIndexView}
                        parentSetSelectedIndexView={(newSelectedIndexView) =>
                            setSelectedIndexView(newSelectedIndexView)
                        }
                        parentSetSlideQuestion={updateSlideThumbnail}
                        renderIcon={(type) => renderIconBaseOnType(type)}
                        updateSavingStatus={updateSavingList}
                    />
                </div>
            </>
        );
    }

    return (
        <>
            <MainHeader />
            <div className="relative flex flex-col w-full h-[90%] overflow-hidden">
                {renderMainChildren()}
                <QuestionChatBtn />
            </div>
            <ModalFrame
                width="w-2/5"
                height="h-[80%]"
                isVisible={showCollabModal}
                clickOutSideToClose={false}
                onClose={() => setShowCollabModal(false)}
            >
                <PresentationCollabModalBody
                    presentationId={parseInt(presentationId, 10)}
                    presentationName={presentationData?.name}
                    inviteId={presentationData?.inviteId}
                    isOwner={isOwner}
                    collaboratorsList={collaboratorsData ?? []}
                    onDeleteCollaboratorBtnClick={(collaboratorToRemove) =>
                        setObjectToRemove(collaboratorToRemove)
                    }
                    updateCollaboratorList={afterRemoveCollaborator}
                />
            </ModalFrame>
            <ModalFrame
                width="w-2/5"
                isVisible={objectToRemove !== null}
                clickOutSideToClose={false}
                hasXCloseBtn={false}
                onClose={() => setObjectToRemove(null)}
            >
                <RemoveModalBody
                    objectToRemove={objectToRemove}
                    onClose={() => setObjectToRemove(null)}
                />
            </ModalFrame>
        </>
    );
}

export default PresentationPresentPage;
