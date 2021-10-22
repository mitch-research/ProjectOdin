import React, { useState, useEffect, useRef } from 'react';
import useResizeAware from "react-resize-aware";
import PropTypes from "prop-types";
import Neovis from "neovis.js/dist/neovis.js";
import Query from './Query';
import DetailsPane from './DetailsPane';
import Box from "@mui/material/Box";


export default function Dash(props){


    const [vis, setVis] = useState('');
    const [slideout, setSlideout] = useState('');
    const [query, setQuery] = useState(false)
    const {
        width,
        height,
        containerId,
        backgroundColor,
        neo4jUri,
        neo4jUser,
        neo4jPassword
    } = props;

    const visRef = useRef();
    const handleQuery = () =>{
      setQuery(!query)
    }
    useEffect(() => {

        const config = {
            container_id: visRef.current.id,
            server_url: neo4jUri,
            server_user: neo4jUser,
            server_password: neo4jPassword,
            labels: {
              //"Character": "name",
              "UNDEFINED":{
                caption:'value'
              },
              "email": {
                  caption: 'value',
                  size: "pagerank",
                  community:"community"
              },
              "ipv4":{
                caption:'value',
                size: "pagerank",
                community:"community"
              },
              "hash":{
                caption:'value'
              },
              "s1_event":{
                caption:'value'
              },
              'md5hash':{
                caption:'value'
              },
              'sha1hash':{
                caption:'value'
              },
              'sha256hash':{
                caption:'value'
              }

          },

            initial_cypher: "MATCH (n) OPTIONAL MATCH (n)-[r]->(m) RETURN *",
            //initial_cypher: "MATCH (n) RETURN (n);"
            
        };
        const vis = new Neovis(config);
        vis.registerOnEvent("completed", () =>{
          console.log('Completed render');
          console.log(Array.from(vis.nodes))
          vis._network.on('click', (nodes)=>{
            var id = nodes.nodes[0];
            if(id){
              setSlideout(vis.nodes.get(id));
            }
          
          })
        })
        vis.render();
        
        setVis(vis)
    }, [neo4jUri, neo4jUser, neo4jPassword]);

    
    

    return(
        <>
            <h1 style={{textAlign:'center'}}>Dash</h1>
            
            <Box sx={{display:'flex'}}>
            {Query(vis)}
            <div id={containerId}
            ref={visRef}
            style={{
                width:`100%`,
                height:`${height}px`,
                backgroundColor: `${backgroundColor}`,
            }}
            />
            {slideout !== '' && 
            <div>
              { DetailsPane(slideout, setSlideout, vis) }
            </div>
            }
            </Box>
        </>
    );
}


Dash.defaultProps = {
    width: 600,
    height: 600,
    backgroundColor: "#d3d3d3",
  };
  
  Dash.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    containerId: PropTypes.string.isRequired,
    neo4jUri: PropTypes.string.isRequired,
    neo4jUser: PropTypes.string.isRequired,
    neo4jPassword: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string,
  };
  
  const ResponsiveNeoGraph = (props) => {
    const [resizeListener, sizes] = useResizeAware();
  
    const side = Math.max(sizes.width, sizes.height) / 2;
    const neoGraphProps = { ...props, width: side, height: side };
    return (
      <div style={{ position: "relative" }}>
        {resizeListener}
        <Dash {...neoGraphProps} />
      </div>
    );
  };
  
  ResponsiveNeoGraph.defaultProps = {
    backgroundColor: "#d3d3d3",
  };
  
  ResponsiveNeoGraph.propTypes = {
    containerId: PropTypes.string.isRequired,
    neo4jUri: PropTypes.string.isRequired,
    neo4jUser: PropTypes.string.isRequired,
    neo4jPassword: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string,
  };
  
  export { Dash, ResponsiveNeoGraph };