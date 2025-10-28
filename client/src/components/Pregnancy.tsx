import React, { useState } from "react";

export default function Pregnancy() {
    const [selectedOption, setSelectedOption] = useState('');
    const [value, setValue] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [inputValue, setInputValue] = useState('');

    const handleTextChange = (e) => {
        setInputValue(e.target.value);
    }

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    }

    const handleChange = (e) => {
        setValue(e.target.value);
    }

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    }

    return (
        <div className="dropdown-container flex flex-1 justify-between items-center">
            <div>
            <h2 className="question text-[#474747]">How many weeks pregnant are you?</h2>
            
            {/* Radio button */}

            <div className="radio-btn">
                <label>
                    <input type="radio" name="radioGroup" value="option1" checked={selectedOption === 'option1'} onChange={handleOptionChange}>
                    </input>
                    <input type="number" value={value} onChange={handleChange} placeholder="Enter the number of weeks"></input>
                </label>
                <br />
                <label>
                    <input type="radio" name="radioGroup" value="option2" checked={selectedOption === 'option2'} onChange={handleOptionChange}>
                    </input>
                    <h2 className="question text-[#474747]">I don't know.</h2> 
                    <p className="question text-[#474747]">Don't worry. We can estimate it for you! When was your last menstrual period?</p>
                    <input type="date" id="lmp" name="lmp" value={selectedDate} onChange={handleDateChange}></input>
                </label>
                <br/>


            </div>
            </div>
        </div>
    )
}