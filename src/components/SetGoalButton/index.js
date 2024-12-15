import React, { useState } from "react";

const SetGoalButton = ({ goalSeconds, setGoalSeconds }) => {
    const [inputValue, setInputValue] = useState(goalSeconds / 3600); // Convert seconds to hours for input

    const handleChange = ({ target: { value }}) => {
        setInputValue(value);
    }
    
    const handleSave = () => {
        const newGoal = Math.max(1, parseInt(inputValue, 10)) * 3600; // Convert hours to to seconds and ensure a minimum of 1 hour
        setGoalSeconds(newGoal);
        localStorage.setItem("fastingGoal", newGoal.toString())
        alert(`Fasting goal set to ${inputValue} hours(s).`)
    }
    
    return (
        <div>
            <lable>
                Set Fasting Goal (hours):(" ")
                <input 
                    type="number"
                    value={inputValue}
                    onChange={handleChange}
                    min="1" 
                    />
            </lable>
            <button onClick={handleSave}>Save Goal</button>
        </div>
    )
}

export default SetGoalButton
