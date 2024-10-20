import { ChangeEvent, useEffect, useState } from "react";
const paramItem = {
  name: "",
  value: "",
  check: false,
};

function Params({ changeParams }) {
  const [paramsData, setParamsData] = useState([{ id: 1, ...paramItem }]);
  useEffect(() => {
    changeParams(paramsData);

    const ultimo = paramsData[paramsData.length - 1];
    if (ultimo.name == "" && ultimo.value == "") {
      if (paramsData.length != 1) {
        const penultimo = paramsData[paramsData.length - 2];
        if (penultimo.name == "" && penultimo.value == "") {
          setParamsData((prevParams) =>
            prevParams.slice(0, prevParams.length - 1)
          );
          setParamsData((prevParams) =>
            prevParams.map((item, index) =>
              index === prevParams.length - 1 ? { ...item, check: false } : item
            )
          );
        }
      }
    } else {
      setParamsData((prevParams) => [
        ...prevParams,
        { id: ultimo.id + 1, ...paramItem },
      ]);
    }
  }, [paramsData]);

  const handleInputChange = (
    id: number,
    event: ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const { value } = event.target;
    setParamsData((prevParams) =>
      prevParams.map((item) =>
        item.id === id ? { ...item, [key]: value, check: true } : item
      )
    );
  };
  const changeCheckBoxParams = (id: number) => {
    setParamsData((prevParams) =>
      prevParams.map((item) =>
        item.id === id ? { ...item, check: !item.check } : item
      )
    );
  };
  return (
    <div>
      {paramsData.map((paramDataItem, index) => (
        <div
          className="flex space-x-5 px-4 py-2 border-b border-white border-opacity-15"
          key={index}
        >
          <input
            type="checkbox"
            disabled={index == paramsData.length - 1}
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

          <input
            type="text"
            className="min-w-[10vw] bg-transparent px-2 py-2 border border-none   rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-200 ease-in-out"
            placeholder="value"
            value={paramDataItem.value}
            onChange={(event) =>
              handleInputChange(paramDataItem.id, event, "value")
            }
          />

          <button>-</button>
        </div>
      ))}
    </div>
  );
}

export default Params;
