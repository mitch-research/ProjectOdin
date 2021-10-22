import axios from 'axios';
import React from 'react';


const serverport = "http://mitchelle.s1.research-dep:3001"

export default function addRelationships(group, value, vis){
    async function addRelCall(newRel, rootVal, rootGroup, visObj){
        console.log(newRel, ' ', rootVal,' ', rootGroup)
        const obj = {
            'root':rootVal,
            'node_type':rootGroup,
            related:[{'value':newRel.label, 'rel_type':'GENERIC', 'node_type':newRel.group}]
        }
        const result = await axios.post(`${serverport}/addRel`, obj)
        console.log(result)
        visObj.reload()
    }

    function formatNodes(){
        const nodes = Array.from(vis.nodes._data.entries());
        const ret = []
        for(const node of nodes){
            if(node[1].label !== value){
                var row = <li key={node[0]}>{node[1].label} <button key={node[0]} onClick={()=>{addRelCall(node[1], value, group, vis)}} > Add Relationship</button></li>
                ret.push(row)
            }
        }
        return <p>{ret}</p>
    }
    
    return(
        <>
        <h3>Add relationships</h3>
        {formatNodes()}
        </>
    )
}