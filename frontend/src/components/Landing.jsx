import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Landing = () =>{

    const navigate = useNavigate()
    const [name, setName] = useState("")
    
        return (
            <div>
                name <br />
                <input type="text" onChange={(e)=> setName(e.target.value)} /> 
    
                <button onClick={(e)=>{
                    navigate(`/room?name=${name}`)
                }}>
                    JOIN
                </button>
    
            </div>
        )
}

export default Landing;