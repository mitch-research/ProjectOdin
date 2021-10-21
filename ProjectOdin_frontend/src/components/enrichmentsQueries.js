import axios from 'axios';
import React from 'react';

const serverport = "http://localhost:3001";

export default function QueryButtons(type, value, vis){
    

    async function handleSubmit(endpoint, val){
        console.log(`Hitting ${endpoint} endpoint for ${val}`)

        const result = await axios.post(`${serverport}/enrichments/${endpoint}`, val);
        console.log(result)
        vis.reload()
    }
    function queryButtons(nodetype, nodevalue){
        const ipv4Buttons = [
            <button onClick={() => handleSubmit('augury',nodevalue)}>Augury Enrichment</button>,
            <button>A random button</button>
        ]
        if(nodetype === 'ipv4'){
            return ipv4Buttons;
        }
    }
    return(
        <>
            {queryButtons(type,value)}
        </>
    );
}