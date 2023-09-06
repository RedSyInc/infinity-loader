import React from "react";

export type TCatImageItem = {
    height: number
    id: string
    url: string
    width: number
}

interface ICatImageProps {
    item: TCatImageItem
}

export const CatImage: React.FC<ICatImageProps> = ({item:{url}}) => {
    return <img className="image-preview" src={url} alt={url}/>
}