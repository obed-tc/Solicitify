import {
  ChangeEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import JsonEditor from "./JsonEditor";
import { useSelector } from "react-redux";
const formItem = {
  name: "",
  value: "",
  file: null,
  check: false,
};
function Body({ changeJsonBody, changeTypeBody, changeFormBody, typeBody }) {
  const [selectedOptionBody, setSelectedOptionBody] = useState(
    typeBody ? typeBody : "None"
  );

  const requestCurrentValue = useSelector(
    (state) => state.requestCurrent.requestCurrent
  );

  const [formData, setFormData] = useState(
    requestCurrentValue &&
      requestCurrentValue.formBody &&
      requestCurrentValue.formBody.length != 0
      ? requestCurrentValue.formBody
      : [{ id: 1, ...formItem }]
  );
  const fileInputRefs = useRef([]);

  const optionsBody = ["None", "Text", "Form", "File"];

  useEffect(() => {
    changeTypeBody(selectedOptionBody);
  }, [selectedOptionBody]);

  useEffect(() => {
    changeFormBody(formData);
    const ultimo = formData[formData.length - 1];
    if (ultimo.name == "" && ultimo.value == "") {
      if (formData.length != 1) {
        const penultimo = formData[formData.length - 2];
        if (penultimo.name == "" && penultimo.value == "") {
          setFormData((prevParams) =>
            prevParams.slice(0, prevParams.length - 1)
          );
          setFormData((prevParams) =>
            prevParams.map((item, index) =>
              index === prevParams.length - 1 ? { ...item, check: false } : item
            )
          );
        }
      }
    } else {
      setFormData((prevParams) => [
        ...prevParams,
        { id: ultimo.id + 1, ...formItem },
      ]);
    }
  }, [formData]);

  const handleChangeBody = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setSelectedOptionBody(event.target.value);
  };

  const handleInputChange = (
    id: number,
    event: ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const { value } = event.target;
    setFormData((prevParams) =>
      prevParams.map((item) =>
        item.id === id ? { ...item, [key]: value, check: true } : item
      )
    );
  };
  const changeCheckBoxParams = (id: number) => {
    setFormData((prevParams) =>
      prevParams.map((item) =>
        item.id === id ? { ...item, check: !item.check } : item
      )
    );
  };
  const handleButtonClick = (index) => {
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index].click();
    }
  };

  const handleFileChange = (event, index) => {
    const file = event.target.files[0];

    const newFormData = [...formData];
    newFormData[index].file = file;
    setFormData(newFormData);
  };

  const handleFileRemove = (index) => {
    const newFormData = [...formData];
    newFormData[index].file = null;
    setFormData(newFormData);
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index].value = "";
    }
  };
  return (
    <div className="p-2">
      <form className="flex space-x-4">
        {optionsBody.map((option) => (
          <div className="flex items-center" key={option}>
            <input
              type="radio"
              id={option}
              name="optionBody"
              value={option}
              checked={selectedOptionBody === option}
              onChange={handleChangeBody}
              className="hidden peer"
            />
            <div
              onClick={() => setSelectedOptionBody(option)}
              className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center peer-checked:before:w-3 peer-checked:before:h-3 peer-checked:before:rounded-full peer-checked:before:bg-blue-500 cursor-pointer"
            ></div>
            <label
              htmlFor={option}
              className="ml-3 text-gray-200 cursor-pointer"
            >
              {option}
            </label>
          </div>
        ))}
      </form>

      {selectedOptionBody == "None" && (
        <div className="flex  items-center h-[40vh] justify-center">
          No body
        </div>
      )}

      {selectedOptionBody == "Text" && (
        <div className="">
          <div className="flex justify-end">
            <span className="text-xs text-gray-400">JSON</span>
          </div>
          <JsonEditor changeJsonBody={changeJsonBody}></JsonEditor>
        </div>
      )}

      {selectedOptionBody == "Form" && (
        <div className="">
          {formData.map((paramDataItem, index) => (
            <div
              className="flex space-x-5 px-4 py-2 border-b border-white border-opacity-15"
              key={index}
            >
              <input
                type="checkbox"
                disabled={index == formData.length - 1}
                onChange={() => changeCheckBoxParams(paramDataItem.id)}
                checked={paramDataItem.check}
              />
              <input
                type="text"
                className="min-w-[5vw] bg-transparent px-2 py-2 border border-none   rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-200 ease-in-out"
                placeholder="name"
                value={paramDataItem.name}
                onChange={(event) =>
                  handleInputChange(paramDataItem.id, event, "name")
                }
              />

              {paramDataItem.file == null ? (
                <input
                  type="text"
                  className="min-w-[13vw] bg-transparent px-2 py-2 border border-none   rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-200 ease-in-out"
                  placeholder="value"
                  value={paramDataItem.value}
                  onChange={(event) =>
                    handleInputChange(paramDataItem.id, event, "value")
                  }
                />
              ) : (
                <div className="min-w-[13vw] bg-transparent px-2 py-2 border border-none   rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-200 ease-in-out">
                  <p className="truncate">{paramDataItem.file.name}</p>
                </div>
              )}

              <input
                type="file"
                ref={(el) => (fileInputRefs.current[index] = el)}
                style={{ display: "none" }}
                onChange={(e) => handleFileChange(e, index)}
              />
              {paramDataItem.file == null ? (
                <button onClick={() => handleButtonClick(index)}>
                  <svg
                    className="w-5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                  >
                    <g clip-path="url(#clip0_61_16736)">
                      <path d="M16.5 6.75112V17.3311C16.5 19.4211 14.97 21.2811 12.89 21.4811C10.5 21.7111 8.5 19.8411 8.5 17.5011V5.14112C8.5 3.83112 9.44 2.64112 10.74 2.51112C12.24 2.36112 13.5 3.53112 13.5 5.00112V15.5011C13.5 16.0511 13.05 16.5011 12.5 16.5011C11.95 16.5011 11.5 16.0511 11.5 15.5011V6.75112C11.5 6.34112 11.16 6.00112 10.75 6.00112C10.34 6.00112 10 6.34112 10 6.75112V15.3611C10 16.6711 10.94 17.8611 12.24 17.9911C13.74 18.1411 15 16.9711 15 15.5011V5.17112C15 3.08112 13.47 1.22112 11.39 1.02112C9.01 0.791123 7 2.66112 7 5.00112V17.2711C7 20.1411 9.1 22.7111 11.96 22.9811C15.25 23.2811 18 20.7211 18 17.5011V6.75112C18 6.34112 17.66 6.00112 17.25 6.00112C16.84 6.00112 16.5 6.34112 16.5 6.75112Z" />
                    </g>
                    <defs>
                      <clipPath id="clip0_61_16736">
                        <rect
                          width="24"
                          height="24"
                          transform="translate(0 0.000976562)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
              ) : (
                <button onClick={() => handleFileRemove(index)}>
                  <svg
                    className="w-5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                  >
                    <g clip-path="url(#clip0_61_15391)">
                      <path d="M6 19.001C6 20.101 6.9 21.001 8 21.001H16C17.1 21.001 18 20.101 18 19.001V9.00098C18 7.90098 17.1 7.00098 16 7.00098H8C6.9 7.00098 6 7.90098 6 9.00098V19.001ZM18 4.00098H15.5L14.79 3.29098C14.61 3.11098 14.35 3.00098 14.09 3.00098H9.91C9.65 3.00098 9.39 3.11098 9.21 3.29098L8.5 4.00098H6C5.45 4.00098 5 4.45098 5 5.00098C5 5.55098 5.45 6.00098 6 6.00098H18C18.55 6.00098 19 5.55098 19 5.00098C19 4.45098 18.55 4.00098 18 4.00098Z" />
                    </g>
                    <defs>
                      <clipPath id="clip0_61_15391">
                        <rect
                          width="24"
                          height="24"
                          transform="translate(0 0.000976562)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {selectedOptionBody == "File" && (
        <div className="">
          <div className="flex justify-end">
            <span className="text-xs text-gray-400">File</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Body;
