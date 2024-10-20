import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeRequestCurrent } from "../features/Request/RequestCurrent";
function Sidebar({ requests }) {
  const requestValue = useSelector((state) => state.request.request);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   getRequestsSave();
  // }, []);
  // const getRequestsSave = () => {
  //   const listaGuardada = localStorage.getItem("requests");
  //   setRequestsSave(listaGuardada ? JSON.parse(listaGuardada) : []);
  // };

  const selectRequest = (requestItem: any) => {
    localStorage.setItem("requestCurrent", JSON.stringify(requestItem));
    dispatch(changeRequestCurrent(requestItem));
  };
  const newRequest = () => {
    dispatch(
      changeRequestCurrent({
        url: "",
        method: "GET",
        response: null,
        typeBodyRequest: "None",
        formBodyRequest: null,
        tab: 0,
        jsonBodyRequest: "",
        formBody: null,
      })
    );
  };
  return (
    <aside className="w-[17vw] bg-black rounded-lg bg-opacity-15 px-2 py-5">
      <button
        className="w-full text-start flex hover:bg-white hover:bg-opacity-10 rounded-md items-center px-5 py-1"
        onClick={newRequest}
      >
        <svg
          className="w-4 mr-3"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
        >
          <path d="M12 4C11.4477 4 11 4.44772 11 5V11H5C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13H11V19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19V13H19C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11H13V5C13 4.44772 12.5523 4 12 4Z" />
        </svg>
        Nueva
      </button>

      {requestValue ? (
        requestValue.map((item, index) => (
          <button
            className="w-full hover:bg-white hover:bg-opacity-10 flex justify-between items-center px-5"
            onClick={() => selectRequest(item)}
            key={index}
          >
            <span
              className={`text-[9px] font-bold mr-5 ${
                item.method == "GET" ? "text-green-500" : "text-orange-500"
              }`}
            >
              {item.method}
            </span>
            <p className="truncate">{item.url}</p>
          </button>
        ))
      ) : (
        <div className="text-center h-[60vh] flex items-center justify-center text-sm text-gray-400">
          No hay api guardadas
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
