import React, {useCallback} from 'react';
import './App.css';
import {InfinityLoader} from "../InfinityLoader/InfinityLoader";
import {CatImage, TCatImageItem} from "../CatImage/CatImage";

export const App: React.FC = () => {
    const fetchData = useCallback(async (page: number, perPage: number): Promise<TCatImageItem[]> => {
        const response = await fetch(`https://api.thecatapi.com/v1/images/search?page=${page}&limit=${perPage}&size=small`,)
        return response.json()
    }, [])

    const renderItem = useCallback((data: TCatImageItem) => <CatImage key={data.id} item={data}/>, [])

    return (
        <div className="App">
            <header className="App-header">
                <h1 className="title">
                    Infinity loader demo
                </h1>
            </header>
            <section className="list-wrap">
                <InfinityLoader<TCatImageItem>
                    fetchData={fetchData}
                    renderItem={renderItem}
                />
            </section>
        </div>
    );
}
