import React from "react";
import PropTypes from "prop-types";

const ProgressBar = (seconds) => {

    const Checktimes = () => {
        console.log (seconds)
    }


    return (
        
            <h2>In progress 
                <button onClick={Checktimes}>Check props</button>
            </h2>
    )
}

ProgressBar.propTypes = {
    seconds: PropTypes.number.isRequired, // Progress percentage (0-100)
  };

export default ProgressBar