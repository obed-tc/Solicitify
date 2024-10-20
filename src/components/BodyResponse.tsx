import { ChangeEvent, SetStateAction, useEffect, useState } from "react";
import Params from "./Params";
import Body from "./Body";
import Auth from "./Auth";
import "../styles/Loading.css";
const options = [
  {
    name: "Params",
  },
  {
    name: "Headers",
  },
  { name: "Auth" },
  {
    name: "Body",
  },
];
function BodyResponse({
  response,
  typeRequest,
  changeParams,
  changeJsonBody,
  changeTypeBody,
  changeFormBody,
  clearResponse,
  changeAuth,
  typeBody,
  acTab,
  changeTab,
  isLoading,
}) {
  return (
    <div className="bg-black bg-opacity-20 rounded-md h-full w-full flex">
      <div className="w-[30vw]">
        <div className=" flex space-x-2 border-b border-opacity-15 border-white text-gray-400 h-[8vh]">
          {options.map((option, index) => (
            <button
              key={index}
              className={`w-[7vw]  ${
                acTab == index && "border-b border-blue-400 text-blue-400"
              } `}
              onClick={() => changeTab(index)}
            >
              {option.name}
            </button>
          ))}
        </div>
        {acTab == 0 && (
          <div>
            <Params changeParams={changeParams}></Params>
          </div>
        )}
        {acTab == 1 && <div className="text-center py-4">Proximamente</div>}
        {acTab == 2 && <Auth changeAuth={changeAuth}></Auth>}
        {acTab == 3 && (
          <Body
            changeJsonBody={changeJsonBody}
            changeTypeBody={changeTypeBody}
            changeFormBody={changeFormBody}
            typeBody={typeBody}
          ></Body>
        )}
      </div>
      <div className=" border-l-[1px] border-white border-opacity-10 px-2 w-full">
        <div className="flex items-center space-x-5 h-[8vh] justify-between ">
          <h4>
            Request <span className="text-yellow-500">{typeRequest}</span>
          </h4>
          <div className="flex space-x-5">
            <div className="bg-white bg-opacity-10 px-5 py-1 rounded-md flex items-center space-x-2">
              <label>Response</label>
              <div
                className={`bg-transparent border border-white ${
                  response == null
                    ? ""
                    : response.status == 200
                    ? "bg-green-500 border-none"
                    : "bg-yellow-500 border-none"
                } rounded-full h-[10px] w-[10px] `}
              ></div>

              <label>{response && response.status}</label>
            </div>
            <button className="text-sm" onClick={clearResponse}>
              Limpiar
            </button>
          </div>
        </div>

        <div className="min-h-[50vh] overflow-y-visible ">
          {response && !isLoading && (
            <pre className="h-[60vh] w-[50vw] overflow-auto ">
              {response.message
                ? JSON.stringify(response.message, null, 2)
                : JSON.stringify(response.data, null, 2)}
              <br />

              {response.response &&
                JSON.stringify(response.response.data, null, 2)}
            </pre>
          )}

          {isLoading && <div className="loader mx-auto mt-[20vh]"></div>}
        </div>
      </div>
    </div>
  );
}

export default BodyResponse;
