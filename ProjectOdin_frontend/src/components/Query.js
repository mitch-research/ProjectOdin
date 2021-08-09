import React, {useState} from 'react';
import axios from 'axios';


const serverport = "http://localhost:3000"
export default function Query(){


    const [results, updateResults] = useState('')
    const [verb, updateVerb] = useState('create')
    const [type, updateType] = useState('ipv4')
    const [desc, updateDescriptionState] = useState('')
    const [value, updateValueState] = useState('')
    function handleValueChange(e){
        updateValueState(e.target.value)
       
    }
    function handleDescriptionChange(e){
        updateDescriptionState(e.target.value)
       
    }

    async function handleSubmit(){
        if(verb === 'create'){
            const route = 'createObj'
            const obj = {
                'type': type,
                'value': value,
                'desc': desc,
            }
            const result = await axios.post(`${serverport}/${route}`,obj)
            
            updateResults(`${result.data.type} - ${result.data.value} - ${result.data.desc} - create ${result.data.result}`)
        }else if(verb === 'delete'){
            const route = 'delObj'
            const obj = {
                'type':type,
                'value': value
            }
            const result = await axios.post(`${serverport}/${route}`, obj)
            
            updateResults(`${result.data.type} - ${result.data.value} - delete ${result.data.result}`)
        }
    }

    function handleVerbChange(verb){
        console.log(`[-] Verb: ${verb}`)
        updateVerb(verb.target.value)
    }

    function handleTypeChange(type){
        console.log(`[-] Type ${type}`)
        updateType(type.target.value)
    }
    function queryBody(){
        if(verb === 'create'){
            return(
                <div>
            <h3>Type</h3>
            <select className="formItem" name="Type" id="type" onChange={(e) => handleTypeChange(e)}>
                <option value="ipv4">IPv4</option>
                <option value="ipv6">IPv6</option>
                <option value="domain">Domain</option>
                <option value="hash">Hash</option>
                <option value="company">Company</option>
                <option value="organization">Organization</option>
                <option value="person">Person</option>
                <option value="alias">Alias</option>
                <option value="url">URL</option>
                <option value="crypto">Crypto Address</option>
                <option value="email">EMail</option>
                <option value="TAG">Threat Actor Group</option>
                <option value="activityCluster">Activity Cluster</option>
                <option value="campaign">Campaign</option>
                <option value="tool">Tool</option>
                <option value="marketplace">Marketplace</option>
                <option value="country">Country</option>
                <option value="stateprovince">State/Province</option>
                <option value="city">City</option>
                <option value="address">Address</option>
                <option value="malware">Malware</option>
                <option value="malwarefamily">Malware Family</option>
                <option value="goventity">Government Entity</option>
            </select>
            <h3>Value</h3>
            <textarea onChange={(e) => handleValueChange(e)}/><br/>
            <h3>Description</h3>
            <textarea onChange={(e) => handleDescriptionChange(e)}/><br/>
            <button onClick={() => handleSubmit()}>Submit</button>
            </div>
            );
        }else if(verb === 'delete'){
            return(
                    <div>
            <h3>Type</h3>
            <select className="formItem" name="Type" id="type" onChange={(e) => handleTypeChange(e)}>
                <option value="ipv4">IPv4</option>
                <option value="ipv6">IPv6</option>
                <option value="domain">Domain</option>
                <option value="hash">Hash</option>
                <option value="company">Company</option>
                <option value="organization">Organization</option>
                <option value="person">Person</option>
                <option value="alias">Alias</option>
                <option value="url">URL</option>
                <option value="crypto">Crypto Address</option>
                <option value="email">EMail</option>
                <option value="TAG">Threat Actor Group</option>
                <option value="activityCluster">Activity Cluster</option>
                <option value="campaign">Campaign</option>
                <option value="tool">Tool</option>
                <option value="marketplace">Marketplace</option>
                <option value="country">Country</option>
                <option value="stateprovince">State/Province</option>
                <option value="city">City</option>
                <option value="address">Address</option>
                <option value="malware">Malware</option>
                <option value="malwarefamily">Malware Family</option>
                <option value="goventity">Government Entity</option>
            </select>
            <h3>Value</h3>
            <textarea onChange={(e) => handleValueChange(e)}/><br/>
            <button onClick={() => handleSubmit()}>Submit</button>
                </div>
            );
        }else if(verb === 'read'){
            return(
            <div>
            <h3>Type</h3>
            <select className="formItem" name="Type" id="type" onChange={(e) => handleTypeChange(e)}>
                <option value="ipv4">IPv4</option>
                <option value="ipv6">IPv6</option>
                <option value="domain">Domain</option>
                <option value="hash">Hash</option>
                <option value="company">Company</option>
                <option value="organization">Organization</option>
                <option value="person">Person</option>
                <option value="alias">Alias</option>
                <option value="url">URL</option>
                <option value="crypto">Crypto Address</option>
                <option value="email">EMail</option>
                <option value="TAG">Threat Actor Group</option>
                <option value="activityCluster">Activity Cluster</option>
                <option value="campaign">Campaign</option>
                <option value="tool">Tool</option>
                <option value="marketplace">Marketplace</option>
                <option value="country">Country</option>
                <option value="stateprovince">State/Province</option>
                <option value="city">City</option>
                <option value="address">Address</option>
                <option value="malware">Malware</option>
                <option value="malwarefamily">Malware Family</option>
                <option value="goventity">Government Entity</option>
            </select>
            <h3>Value</h3>
            <textarea onChange={(e) => handleValueChange(e)}/><br/>
            <button onClick={() => handleSubmit()}>Submit</button>
                </div>
                );
        }else{
            return(
                <div>
                    <p>TODO</p>
                </div>
            );
        }
    }
    return(
        <>
            <h1>Query</h1>
            <h3>Verb</h3>
            <select className="formItem" name="Verb" id="verb" onChange={(e) => handleVerbChange(e)}>
                <option value="create">CREATE</option>
                <option value="read">READ</option>
                <option value="update">UPDATE</option>
                <option value="delete">DELETE</option>
            </select>
            {queryBody()}
            <h3>Results</h3>
            {results === '' ?
                <p>No results!</p> 
                : 
                <p>[-] {results}</p>
            }
        </>
    );
}