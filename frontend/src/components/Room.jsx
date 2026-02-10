import { useEffect } from "react";
import { useState } from "react"
import { useSearchParams } from "react-router-dom"

export const Room = () => {
    const [searchParam, setSearchParam] = useSearchParams();
    const name = searchParam.get("name")

    useEffect(()=>{
        //write join loggic here 

    },[name])


    return (
        <div>
            helo{name}

        </div>
    )
}