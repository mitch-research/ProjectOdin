import React, {useState} from 'react';

export default function Result(resArray){
    console.log('[-] Initializing results table')
    
    const [resTable, setResTable] = useState('<table> <thead> <tr> <td> Type </td> <td> Value </td> <td> Description </td> </tr> </thead> <tbody>');

    
    return(
        <>
            {resTable}
        </>
    );
}