import axios from 'axios';
import React from 'react';

const serverport = "http://mitchelle.s1.research-dep:5000";

export default function QueryButtons(type, value, vis){
    

    async function handleSubmit(endpoint, val){
        console.log(`Hitting ${endpoint} endpoint for ${val}`)

        const result = await axios.post(`${serverport}/enrichments/${endpoint}`, {'hash':val});
        console.log(result)
        vis.reload()
    }
    function queryButtons(nodetype, nodevalue){
        const ipv4Buttons = [
            <button onClick={() => handleSubmit('augury',nodevalue)}>Augury Enrichment</button>,
            <button onClick={() => handleSubmit('s1_ip',nodevalue)}>SentinelOne IP Enrichment</button>,
            <button>A random button</button>
        ]
        const hashButtons = [
            <button onClick={() => handleSubmit('s1_hash',nodevalue)}>SentinelOne Hash Enrichment</button>,
            <button>A random button</button>
        ]
        if(nodetype === 'ipv4'){
            return ipv4Buttons;
        }else if(nodetype === 'hash'){
            return hashButtons
        }
    }
    return(
        <>
            {queryButtons(type,value)}
        </>
    );
}