import React from 'react';
import QueryButtons from './enrichmentsQueries';
import addRelationships from './addRelationships';

export default function DetailsPane(props, setSlideout, vis){
    const group = props.raw.labels[0];
    console.log(props.raw)
    const {
        value,
        description
    } = props.raw.properties;
    return(
        <>
            <button onClick={() => {setSlideout('')}}>Close</button>
            <h1>{group} Details</h1>
            <p>Value: {value}</p>
            <p>Description:<br/>{description}</p>
            {addRelationships(group, value, vis)}
            {QueryButtons(group, value, vis)}

        </>
    );
}