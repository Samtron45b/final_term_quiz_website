/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-unused-vars */
import PropTypes from "prop-types";
import { ImSpinner10 } from "react-icons/im";
import React, { useRef, useCallback, useState, useEffect } from "react";

export default function InfiniteScroll({
    controllerRef,
    dataSource,
    reversed,
    hasMore,
    itemRender,
    dividerRender,
    loadMore
}) {
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const executeLoadMoreFunction = async () => {
        setIsLoading(true);
        loadMore?.().then(() => {
            setIsLoading(false);
        });
    };

    const boxRef = controllerRef ?? useRef();

    const observer = useRef();
    const lastData = useCallback(
        (node) => {
            if (isLoading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    executeLoadMoreFunction();
                }
            });
            if (node) observer.current.observe(node);
        },
        [reversed, isLoading, hasMore]
    );

    const renderLoadingItem = (offset) => {
        if ((offset === 0 && !reversed) || (offset === 1 && reversed) || !isLoading) {
            return null;
        }
        return (
            <div className="flex justify-center items-center">
                <ImSpinner10 size={50} className="animate-spin mr-3 mb-2" />
            </div>
        );
    };

    useEffect(() => {
        console.log(dataSource);
        console.log(boxRef.current.scrollHeight);
        if (reversed) {
            boxRef.current.scrollTo({ left: 0, top: boxRef.current.scrollHeight });
        } else {
            boxRef.current.scrollTo({ left: 0, top: 0 });
        }
    }, [reversed]);

    if (isLoading) console.log("isLoading");

    return (
        <div ref={boxRef} className="h-full w-full overflow-auto">
            {renderLoadingItem(0)}
            {dataSource.map((childData, index) => {
                if ((!reversed && dataSource.length - 1 === index) || (reversed && index === 0)) {
                    return (
                        <div ref={lastData} key={childData.id ?? index}>
                            {index !== 0 ? dividerRender : null}
                            {itemRender(childData, index)}
                        </div>
                    );
                }
                return (
                    <div key={childData.id ?? index}>
                        {index !== 0 ? dividerRender : null}
                        {itemRender(childData, index)}
                    </div>
                );
            })}
            {renderLoadingItem(1)}
            <div>{error && "Error"}</div>
        </div>
    );
}

InfiniteScroll.propTypes = {
    controllerRef: PropTypes.any,
    dataSource: PropTypes.array,
    reversed: PropTypes.bool,
    hasMore: PropTypes.bool,
    itemRender: PropTypes.func,
    dividerRender: PropTypes.any,
    loadMore: PropTypes.func
};

InfiniteScroll.defaultProps = {
    controllerRef: null,
    dataSource: [],
    reversed: false,
    hasMore: false,
    itemRender: null,
    dividerRender: null,
    loadMore: null
};
