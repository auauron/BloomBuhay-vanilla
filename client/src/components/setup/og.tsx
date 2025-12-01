 (
    <div className="bg-bloomWhite min-h-screen flex flex-col">
      <SetupHeader />
      <div className="flex-1 flex justify-center px-6 mt-1">
        <div
          style={{ maxWidth: "1000px" }}
          className="flex justify-center w-full"
        >
          <div
            style={{ maxWidth: "1000px", maxHeight: "450px" }}
            className="dropdown-container bg-white w-full m-auto rounded-2xl max-h-[80vh] scrollbar-thin overflow-y-auto scrollbar-thumb-white/50 scrollbar-track hover:scrollbar-thumb-white/50 shadow-lg p-6 pb-4 mb-8"
          >
            <div className="text-left">
              <h2 className="text-bloomBlack font-semibold">
                How many weeks pregnant are you?
              </h2>

              {/* Radio options */}
              <div className="radio-btn">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="radioGroup"
                    value="option1"
                    checked={selectedOption === "option1"}
                    onChange={handleOptionChange}
                    className="w-3 h-3 focus:ring-bloomPink focus:ring-2 focus:ring-opacity-50 rounded-full checked:bg-bloomPink checked:border-bloomPink appearance-none focus:outline-none border-2"
                  />
                  <div className="w-[270px]">
                    <InputField
                      label=""
                      type="number"
                      min="0"
                      max="40"
                      value={value}
                      onChange={(val) => {
                        const num = Number(val);

                        if (val === "") {
                          setValue("");
                          setWeekError("");
                        } else if (isNaN(num) || num < 0) {
                          setWeekError("Please enter a valid number");
                        } else if (num > 40) {
                          setWeekError("Pregnancy typically lasts up to 40 weeks");
                          setValue("40");
                        } else {
                          setValue(val);
                          setWeekError("");
                        }
                      }}
                      placeholder="Enter the number of weeks (max 40)"
                    />
                    {weekError && (
                      <p className="text-red-500 text-sm mt-1">{weekError}</p>
                    )}
                  </div>
                </label>

                <br />

                <label className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="radioGroup"
                    value="option2"
                    checked={selectedOption === "option2"}
                    onChange={handleOptionChange}
                    className="w-3 h-3 focus:ring-bloomPink focus:ring-2 focus:ring-opacity-50 rounded-full checked:bg-bloomPink checked:border-bloomPink appearance-none focus:outline-none border-2 mt-1"
                  />
                  <div className="flex-1">
                    <h2 className="text-bloomBlack font-semibold">
                      I don't know.
                    </h2>
                    <p className="text-bloomBlack">
                      Don't worry. We can estimate it for you! When was your
                      last menstrual period?
                    </p>
                    <div className="w-60 mt-2">
                      <InputField
                        label=""
                        type="date"
                        value={selectedDate}
                        onChange={setSelectedDate}
                        placeholder="Select the date"
                      />
                    </div>
                  </div>
                </label>

                {/* Baby's details */}
                <hr className="border-gray-200 my-4 mt-4" />
                <div className="baby-details mt-4">
                  <label>
                    <h2 className="font-semibold text-bloomBlack">
                      Baby's Name (Optional)
                    </h2>
                    <div className="ml-6 mt-3 w-60">
                      <InputField
                        label=""
                        type="text"
                        value={inputValue}
                        onChange={(val) =>
                          setInputValue(val.replace(/[^a-zA-Z\s]/g, ""))
                        }
                        placeholder="Enter your baby's name"
                      />
                    </div>
                  </label>

                  <label>
                    <h2 className="mt-4 font-semibold text-bloomBlack">
                      Baby's Gender (Optional)
                    </h2>
                  </label>

                  <div className="relative mb-4 w-[350px] ml-6" ref={dropdownRef}>
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className="flex items-center justify-between p-4 mt-4 border-gray-300 border rounded-lg bg-white hover:border-[#F875AA] transition-colors text-left w-full"
                      type="button"
                    >
                      <span
                        className={
                          selectedGender ? "text-bloomBlack" : "text-[#9a9a9a]"
                        }
                      >
                        {selectedGender || "What's your baby's gender?"}
                      </span>
                      <ChevronDownIcon
                        size={20}
                        className={`text-[#9a9a9a] transition-transform ${isOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {/* Dropdown menu */}
                    {isOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-[#9a9a9a] rounded-lg shadow-lg z-10 w-full">
                        {babyGenders.map((gender) => (
                          <div
                            key={gender}
                            onClick={() => handleGenderSelect(gender)}
                            className={`p-4 hover:bg-bloomWhite transition-colors ${selectedGender === gender
                                ? "bg-bloomWhite text-bloomPink"
                                : "text-bloomBlack"
                              } cursor-pointer`}
                          >
                            {gender}
                          </div>
                        ))}
                      </div>
                    )}
                  </div><div className="ml-4 ">
                    <NextButton
                      onComplete={handleNext}
                      // Remove gender requirement from isReady condition
                      isReady={weeksOrLmpFilled}
                    />
                  </div>
                </div>

                  
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );

// postpartum

     <div className="bg-bloomWhite min-h-screen flex flex-col">
      <SetupHeader />
      <div className="flex-1">
        <div
          style={{ maxWidth: "800px" }}
          className="flex justify-center px-6 mt-2"
        >
          <div
            style={{ maxWidth: "700px", maxHeight: "450px" }}
            className="dropdown-container bg-white w-full m-auto rounded-2xl max-h-[80vh] scrollbar-thin overflow-y-auto scrollbar-thumb-white/50 scrollbar-track hover:scrollbar-thumb-white/50 shadow-lg p-8 pb-4 mb-6"
          >
            <div className="text-left ">
              <h2 className="text-bloomBlack font-semibold">
                How many weeks has it been since you gave birth?
              </h2>
              <div className="ml-4 w-60 m-4">
                <InputField
                  label=""
                  type="number"
                  min="0"
                  value={value}
                  onChange={(val) => {
                    const num = Number(val);

                    if (val === "") {
                      setValue("");
                      setWeekError("");
                    } else if (isNaN(num) || num < 0) {
                      setWeekError("Please enter a valid number");
                    } else {
                      setValue(val);
                      setWeekError("");
                    }
                  }}
                  placeholder="Enter the number of weeks"
                />
                {weekError && (
                  <p className="text-red-500 text-sm mt-1">{weekError}</p>
                )}
              </div>
            </div>

            {/* baby's details */}
            <hr className="border-gray-200 my-4" />
            <div className="baby-details flex flex-col items-start">
              <label className="block">
                <h2 className="font-semibold text-bloomBlack text-left">
                  Baby's Name
                </h2>
                <div className="mt-3 ml-4 w-64">
                  <InputField
                    label=""
                    type="text"
                    value={inputValue}
                    onChange={(val) =>
                      setInputValue(val.replace(/[^a-zA-Z\s]/g, ""))
                    }
                    placeholder="Enter your baby's name"
                  />
                </div>
              </label>
              <label className="block">
                <h2 className="mt-4 font-semibold text-bloomBlack text-left">
                  Baby's Gender
                </h2>
              </label>
              <div className="relative mb-4 ml-4 text-left">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center justify-between p-4 mt-4 border border-gray-300 rounded-lg bg-white hover:border-[#F875AA] transition-colors cursor-pointer text-left w-full"
                  type="button"
                >
                  <span
                    className={
                      selectedGender ? "text-bloomBlack" : "text-[#9a9a9a]"
                    }
                  >
                    {selectedGender || "What's your baby's gender?"}
                  </span>
                  <ChevronDownIcon
                    size={20}
                    className={`text-[#9a9a9a] transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown menu */}
                {isOpen && (
                  <div className="absolute left-0 top-full mt-1 bg-white border border-[#9a9a9a] rounded-lg shadow-lg z-20 w-full">
                    {babyGenders.map((gender) => (
                      <div
                        key={gender}
                        onClick={() => handleGenderSelect(gender)}
                        className={`p-4 hover:bg-bloomWhite transition-colors cursor-pointer ${
                          selectedGender === gender
                            ? "text-bloomPink"
                            : "text-bloomBlack"
                        }`}
                      >
                        {gender}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* radio btn track recovery and milestones */}
              

              {/* Next button */}
              <NextButton
                onComplete={handleNext}
                isReady={Boolean(inputValue && value && selectedGender)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>