import React, { useState } from "react";

import { TbEdit } from "react-icons/tb";

import { BsCheck2 } from "react-icons/bs";

function InputEdit({heading, type, input, handleChange, handleSubmit }) {
  const [isEditable, setisEditable] = useState(false);

  const submitButton = () => {
    handleSubmit();
    setisEditable(false);
  };

  return (
    <>
      <div className="flex flex-col py-4 mt-4 bg[-#ffff] shadow-md px-4 gap-y-3">
        <p>{heading}</p>

        {!isEditable ? (
          <div className="flex justify-between items-center">
            <p>{input}</p>

            <button onClick={() => setisEditable(!isEditable)}>
              <TbEdit />
            </button>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <div>
              <input
                onChange={handleChange}
                name={type}
                type="text"
                value={input}
              />
            </div>

            <div className="flex items-center gap-x-4">
              <button onClick={submitButton}>
                <BsCheck2 />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default InputEdit;

