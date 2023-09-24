import React, {memo, useCallback, useEffect, useRef, useState} from "react"
import './InfinityLoader.css';

interface IInfinityLoaderProps<T> {
    fetchData: (page: number, perPage: number) => Promise<T[]>
    renderItem: (item: T) => React.ReactNode
    initialPage?: number
    perPage?: number
    scrollThreshold?: number
}

const InfinityLoaderInner = <T, >({
                                        fetchData,
                                        renderItem,
                                        initialPage = 1,
                                        perPage = 10,
                                        scrollThreshold = 0,
                                    }: IInfinityLoaderProps<T>) => {
    const loaderRef = useRef<HTMLDivElement | null>(null)
    const [items, setItems] = useState<T[]>([])
    const [page, setPage] = useState(initialPage)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const loadMore = useCallback(async () => {
        setIsLoading(true)

        try {
            const newItems: T[] = await fetchData(page, perPage)

            setItems((prev: T[]) => [...prev, ...newItems])
            setPage((prev: number) => prev + 1)
        } catch (error) {
            setError('Something went wrong')
        } finally {
            setIsLoading(false)
        }

    }, [page, perPage, fetchData])

    const handleObserver = useCallback(async (entries: IntersectionObserverEntry[]) => {
            if (isLoading || error) { // error doc. try again button
                return
            }

            const [target] = entries

            if (target?.isIntersecting) {
                await loadMore()
            }
        },
        [loadMore, isLoading, error],
    )

    useEffect(() => {
        const options = {
            rootMargin: `${scrollThreshold}px`,
        }

        const observer = new IntersectionObserver(handleObserver, options)

        if (loaderRef.current) {
            observer.observe(loaderRef.current)
        }

        return () => observer.disconnect()
    }, [handleObserver, scrollThreshold])

    return <>
        {items.map(item => renderItem(item))}
        {error && <div className="error-message">Error: {error}</div>}
        {!error && <div ref={loaderRef}>
            <div className="lds-circle">
                <div></div>
            </div>
        </div>}
    </>
}

export const InfinityLoader = memo(InfinityLoaderInner) as typeof InfinityLoaderInner