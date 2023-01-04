/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-unused-vars */
import PropTypes from "prop-types";
import { ImSpinner10 } from "react-icons/im";
import React, { useRef, useCallback, useState, useEffect } from "react";

export default function InfiniteScroll({
    controllerRef,
    initialPage,
    totalPage,
    pageLength,
    dataSource,
    reversed,
    loadOnInitial,
    itemRender,
    dividerRender,
    loadMore,
    handleOnScroll
}) {
    const [page, setPage] = useState(initialPage);
    const [doInitialLoad, setDoInitialLoad] = useState(loadOnInitial);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [hasMore, setHasMore] = useState(false);

    console.log("dataSource", dataSource);

    const executeLoadMoreFunction = async (curPage) => {
        setIsLoading(true);
        loadMore?.(curPage, pageLength).then(() => {
            setIsLoading(false);
            setHasMore(page < totalPage);
        });
    };

    const boxRef = controllerRef ?? useRef();

    const observer = useRef();
    const lastData = useCallback(
        (node) => {
            console.log("run in callback list");
            if (isLoading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    console.log("now run in here");
                    setPage((curPage) => {
                        console.log("curPage", curPage);
                        return curPage + 1;
                    });
                }
            });
            if (node) observer.current.observe(node);
        },
        [reversed, dataSource, isLoading, hasMore]
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
        if (reversed) {
            boxRef.current.scrollTo({ left: 0, top: boxRef.current.scrollHeight });
        } else {
            boxRef.current.scrollTo({ left: 0, top: 0 });
        }
    }, [reversed]);

    useEffect(() => {
        setDoInitialLoad((curDoInitialLoad) => {
            if (curDoInitialLoad) {
                executeLoadMoreFunction(1);
            } else {
                setHasMore(page < totalPage);
            }
            return false;
        });
    }, []);

    useEffect(() => {
        console.log("total page, page", totalPage, page);
        if (page > 1 && page <= totalPage) {
            executeLoadMoreFunction(page);
        }
    }, [page]);

    if (isLoading) console.log("isLoading");

    return (
        <div ref={boxRef} onScroll={handleOnScroll} className="h-full w-full overflow-auto">
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
    initialPage: PropTypes.number,
    totalPage: PropTypes.number,
    pageLength: PropTypes.number,
    dataSource: PropTypes.array,
    reversed: PropTypes.bool,
    loadOnInitial: PropTypes.bool,
    itemRender: PropTypes.func,
    dividerRender: PropTypes.any,
    loadMore: PropTypes.func,
    handleOnScroll: PropTypes.func
};

InfiniteScroll.defaultProps = {
    controllerRef: null,
    initialPage: 1,
    totalPage: 1,
    pageLength: 10,
    dataSource: [],
    reversed: false,
    loadOnInitial: false,
    itemRender: null,
    dividerRender: null,
    loadMore: null,
    handleOnScroll: null
};
