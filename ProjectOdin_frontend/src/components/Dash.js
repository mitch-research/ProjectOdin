import React, { useEffect, useRef } from 'react';
import useResizeAware from "react-resize-aware";
import PropTypes from "prop-types";
import Neovis from "neovis.js/dist/neovis.js";

export default function Dash(props){

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

    useEffect(() => {

        const config = {
            container_id: visRef.current.id,
            server_url: neo4jUri,
            server_user: neo4jUser,
            server_password: neo4jPassword,

            labels: {
                ipv4: {
                    caption: 'value'
                },
                email: {
                    caption: 'value'
                }
            },

            initial_cypher: "MATCH (n) RETURN (n)"
            
        };

        const vis = new Neovis(config);
        vis.render();
    }, [neo4jUri, neo4jUser, neo4jPassword]);



    return(
        <>
            <h1>Dash</h1>

            
            <div id={containerId}
            ref={visRef}
            style={{
                width:`100%`,
                height:`${height}px`,
                backgroundColor: `${backgroundColor}`,
            }}/>
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