import React, { useRef, useCallback, useState, useEffect } from "react";
import axios from "axios";

function Fetching(query, pageNumber) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [data, setData] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        setData([]);
    }, [query]);

    useEffect(() => {
        setLoading(true);
        setError(false);
        let cancel;
        axios
            .get("https://openlibrary.org/search.json", {
                params: { q: query, page: pageNumber },
                cancelToken: new axios.CancelToken((c) => {
                    cancel = c;
                })
            })
            .then((res) => {
                setData((prev) => {
                    return [...new Set([...prev, ...res.data.docs.map((b) => b.title)])];
                });
                setHasMore(res.data.docs.length > 0);
                setLoading(false);
            })
            .catch((err) => {
                if (axios.isCancel(err)) return;
                setError(true);
            });
        return () => cancel();
    }, [query, pageNumber]);
    return { loading, error, data, hasMore };
}

export default function InfiniteScroll() {
    const [page, setPage] = useState(1);
    const { loading, error, data, hasMore } = Fetching("The lord of the ring", page);

    const observer = useRef();
    const lastData = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prePageNum) => prePageNum + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    return (
        <>
            {data.map((childData, index) => {
                if (data.length === index + 1) {
                    return (
                        <div ref={lastData} key={childData}>
                            {childData}
                        </div>
                    );
                }
                return <div key={childData}>{childData}</div>;
            })}
            <div>{loading && "Loading..."}</div>
            <div>{error && "Error"}</div>
        </>
    );
}
