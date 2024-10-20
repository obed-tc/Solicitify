/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from "react";
import BodyResponse from "./BodyResponse";
import axios from "axios";
import { useDispatch } from "react-redux";
import { changeRequest } from "../features/Request/Request";
import { changeRequestCurrent } from "../features/Request/RequestCurrent";
import { useSelector } from "react-redux";
function Content() {
  const dispatch = useDispatch();
  const requestCurrentValue = useSelector(
    // @ts-expect-error
    (state) => state.requestCurrent.requestCurrent
  );
  const [isLoading, setIsLoading] = useState(false);

  const [method, setMethod] = useState(
    requestCurrentValue ? requestCurrentValue.method : "GET"
  );
  const [url, setUrl] = useState(
    requestCurrentValue ? requestCurrentValue.url : ""
  );
  const [responseRequest, setResponseRequest] = useState(
    requestCurrentValue ? requestCurrentValue.response : null
  );

  const [typeBodyRequest, setTypeBodyRequest] = useState(
    requestCurrentValue ? requestCurrentValue.typeBodyRequest : "None"
  );
  const [jsonBodyRequest, setJsonBodyRequest] = useState(
    requestCurrentValue ? requestCurrentValue.jsonBodyRequest : ""
  );
  const [formBodyRequest, setFormBodyRequest] = useState(
    requestCurrentValue ? requestCurrentValue.formBody : null
  );

  const [authData, setAuthData] = useState(
    requestCurrentValue ? requestCurrentValue.authData : null
  );

  const [activeTab, setActiveTab] = useState(
    requestCurrentValue ? requestCurrentValue.tab : 0
  );

  useEffect(() => {
    dispatch(
      changeRequestCurrent({
        url: url,
        method: method,
        response: responseRequest,
        typeBodyRequest: typeBodyRequest,
        tab: activeTab,
        jsonBodyRequest: jsonBodyRequest,
        formBody: formBodyRequest,
        authData: authData,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    url,
    method,
    responseRequest,
    typeBodyRequest,
    formBodyRequest,
    activeTab,
    jsonBodyRequest,
    formBodyRequest,
    authData,
  ]);

  useEffect(() => {
    if (requestCurrentValue != null) {
      setUrl(requestCurrentValue.url);
      setMethod(requestCurrentValue.method);
      setResponseRequest(requestCurrentValue.response);
      setTypeBodyRequest(requestCurrentValue.typeBodyRequest);
      setActiveTab(requestCurrentValue.tab);
      setJsonBodyRequest(requestCurrentValue.jsonBodyRequest);
      setFormBodyRequest(requestCurrentValue.formBody);
      setAuthData(requestCurrentValue.authData);
    }
  }, [requestCurrentValue]);

  const clearResponse = () => {
    setResponseRequest(null);
  };

  const changeTab = (tab) => {
    setActiveTab(tab);
  };
  const changeAuth = (authData) => {
    setAuthData(authData);
  };
  const changeJsonBody = (b) => {
    setJsonBodyRequest(b);
  };

  const changeFormBody = (b) => {
    const data = b.filter((item) => item.check == true);

    setFormBodyRequest(data);
  };

  const changeTypeBody = (t) => {
    setTypeBodyRequest(t);
  };

  const saveRequest = () => {
    const listaGuardada = localStorage.getItem("requests");
    if (listaGuardada) {
      const listaActual = JSON.parse(listaGuardada);
      const nuevaLista = [
        ...listaActual,
        {
          url: url,
          method: method,
          response: responseRequest,
          typeBodyRequest: typeBodyRequest,
          tab: activeTab,
          jsonBodyRequest: jsonBodyRequest,
          formBody: formBodyRequest,
          authData: authData,
        },
      ];
      dispatch(changeRequest(nuevaLista));
      localStorage.setItem("requests", JSON.stringify(nuevaLista));
    } else {
      dispatch(
        changeRequest([
          {
            url: url,
            method: method,
            response: responseRequest,
            typeBodyRequest: typeBodyRequest,
            tab: activeTab,
            jsonBodyRequest: jsonBodyRequest,
            formBody: formBodyRequest,
            authData: authData,
          },
        ])
      );

      localStorage.setItem(
        "requests",
        JSON.stringify([
          {
            url: url,
            method: method,
            response: responseRequest,
            typeBodyRequest: typeBodyRequest,
            tab: activeTab,
            jsonBodyRequest: jsonBodyRequest,
            formBody: formBodyRequest,
            authData: authData,
          },
        ])
      );
    }
  };

  const generarQueryString = (lista: []) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const elementosConCheck = lista.filter((item) => item.check === true);

    const queryString = elementosConCheck
      .map(
        (item) =>
          // @ts-expect-error
          `${encodeURIComponent(item.name)}=${encodeURIComponent(item.value)}`
      )
      .join("&");

    return `${queryString}`;
  };

  const changeParams = (p) => {
    const data = p.filter((item) => item.check == true);
    if (data.length >= 1) {
      setUrl(url.split("?")[0] + "?" + generarQueryString(data));
    } else {
      setUrl(url.split("?")[0]);
    }
  };
  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMethod(e!.target.value);
  };
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e!.target.value);
  };
  const submitRequest = async () => {
    if (url == "") {
      return;
    }

    if (method == "POST") {
      postRequest(url);
    } else if (method == "PUT") {
      putRequest(url);
    } else if (method == "PATCH") {
      patchRequest(url);
    } else if (method == "DELETE") {
      deleteRequest(url);
    } else {
      getRequest(url);
    }
  };

  const getRequest = async (urlString: string) => {
    setIsLoading(true);
    const headers: { [key: string]: string } = {};

    if (authData) {
      if (authData.type === "BearerToken") {
        headers.Authorization = `Bearer ${authData.token}`;
      } else if (authData.type === "APIKey") {
        headers["x-api-key"] = authData.apiKey;
      } else if (authData.type === "BasicAuth") {
        const credentials = btoa(`${authData.username}:${authData.password}`);
        headers.Authorization = `Basic ${credentials}`;
      }
    }

    try {
      const response = await axios.get(urlString, { headers });
      setResponseRequest(response);
      setIsLoading(false);
    } catch (error) {
      setResponseRequest(error);
      setIsLoading(false);
    }
  };

  const postRequest = async (urlString: string) => {
    setIsLoading(true);
    let res;
    const headers: { [key: string]: string } = {};

    if (typeBodyRequest !== "None") {
      headers["Content-Type"] =
        typeBodyRequest === "Form" ? "multipart/form-data" : "application/json";

      if (authData) {
        if (authData.type === "BearerToken") {
          headers.Authorization = `Bearer ${authData.token}`;
        } else if (authData.type === "APIKey") {
          headers["x-api-key"] = authData.apiKey;
        } else if (authData.type === "BasicAuth") {
          const credentials = btoa(`${authData.username}:${authData.password}`);
          headers.Authorization = `Basic ${credentials}`;
        }
      }
    }

    try {
      if (typeBodyRequest === "Text" && jsonBodyRequest != null) {
        res = await axios.post(urlString, jsonBodyRequest, { headers });
        setIsLoading(false);

        setResponseRequest(res);
      } else if (typeBodyRequest === "Form" && formBodyRequest != null) {
        const formData = new FormData();
        formBodyRequest.forEach((item) => {
          if (item.file != null) {
            formData.append(item.name, item.file);
          } else {
            formData.append(item.name, item.value);
          }
        });

        res = await axios.post(urlString, formData, { headers });
        setIsLoading(false);

        setResponseRequest(res);
      } else {
        res = await axios.post(urlString);
        setIsLoading(false);

        setResponseRequest(res);
      }
    } catch (error) {
      setResponseRequest(error);
      setIsLoading(false);
    }
  };
  const putRequest = async (urlString: string) => {
    setIsLoading(true);
    const headers: { [key: string]: string } = {};
    if (authData) {
      if (authData.type === "BearerToken") {
        headers.Authorization = `Bearer ${authData.token}`;
      } else if (authData.type === "APIKey") {
        headers["x-api-key"] = authData.apiKey;
      } else if (authData.type === "BasicAuth") {
        const credentials = btoa(`${authData.username}:${authData.password}`);
        headers.Authorization = `Basic ${credentials}`;
      }
    }

    try {
      let dataToSend;

      if (typeBodyRequest !== "None") {
        if (typeBodyRequest === "Text" && jsonBodyRequest != null) {
          dataToSend = jsonBodyRequest;
        } else if (typeBodyRequest === "Form" && formBodyRequest != null) {
          const formData = new FormData();
          formBodyRequest.forEach((item) => {
            if (item.file != null) {
              formData.append(item.name, item.file);
            } else {
              formData.append(item.name, item.value);
            }
          });
          dataToSend = formData;
        }
      }

      const response = await axios.put(urlString, dataToSend || {}, {
        headers,
      });
      setResponseRequest(response);
    } catch (error) {
      setResponseRequest(error);
    } finally {
      setIsLoading(false);
    }
  };

  const patchRequest = async (urlString: string) => {
    setIsLoading(true);
    const headers: { [key: string]: string } = {};

    if (authData) {
      if (authData.type === "BearerToken") {
        headers.Authorization = `Bearer ${authData.token}`;
      } else if (authData.type === "APIKey") {
        headers["x-api-key"] = authData.apiKey;
      } else if (authData.type === "BasicAuth") {
        const credentials = btoa(`${authData.username}:${authData.password}`);
        headers.Authorization = `Basic ${credentials}`;
      }
    }

    try {
      let dataToSend;

      if (typeBodyRequest !== "None") {
        if (typeBodyRequest === "Text" && jsonBodyRequest != null) {
          dataToSend = jsonBodyRequest;
        } else if (typeBodyRequest === "Form" && formBodyRequest != null) {
          const formData = new FormData();
          formBodyRequest.forEach((item) => {
            if (item.file != null) {
              formData.append(item.name, item.file);
            } else {
              formData.append(item.name, item.value);
            }
          });
          dataToSend = formData;
        }
      }

      const response = await axios.patch(urlString, dataToSend || {}, {
        headers,
      });
      setResponseRequest(response);
    } catch (error) {
      setResponseRequest(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRequest = async (urlString: string) => {
    setIsLoading(true);
    const headers: { [key: string]: string } = {};

    if (authData) {
      if (authData.type === "BearerToken") {
        headers.Authorization = `Bearer ${authData.token}`;
      } else if (authData.type === "APIKey") {
        headers["x-api-key"] = authData.apiKey;
      } else if (authData.type === "BasicAuth") {
        const credentials = btoa(`${authData.username}:${authData.password}`);
        headers.Authorization = `Basic ${credentials}`;
      }
    }

    try {
      const response = await axios.delete(urlString, { headers });
      setResponseRequest(response);
    } catch (error) {
      setResponseRequest(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-2 w-[83vw] flex flex-col space-y-5 ">
      <div className="flex items-center rounded-lg bg-black bg-opacity-30">
        <select
          name="select"
          value={method}
          onChange={handleMethodChange}
          className={` px-3 py-3 bg-transparent  font-semibold ${
            method == "GET"
              ? "text-green-400"
              : method == "POST"
              ? "text-yellow-500"
              : method == "DELETE"
              ? "text-red-500"
              : "text-orange-500"
          }  mr-4`}
        >
          <option className="text-green-600 bg-black" value="GET">
            GET
          </option>
          <option className="text-yellow-500 bg-black" value="POST">
            POST
          </option>
          <option className="text-orange-600 bg-black" value="PUT">
            PUT
          </option>
          <option className="text-orange-600 bg-black" value="PATCH">
            PATCH
          </option>
          <option className="text-red-500 bg-black" value="DELETE">
            DELETE
          </option>
        </select>
        <input
          className="w-full bg-transparent px-2 py-2 border border-none    shadow-sm focus:outline-none focus:ring-0 focus:ring-primary-500 focus:border-primary-500 transition duration-200 ease-in-out"
          maxLength={240}
          placeholder="Ingrese la url o pega el texto"
          value={url}
          onChange={handleUrlChange}
        />
        <button
          className="bg-white text-black font-semibold px-4 py-1 rounded-lg hover:bg-gray-200"
          onClick={submitRequest}
        >
          Enviar
        </button>
        <button
          className="border border-gray-600 font-semibold px-4 py-1 rounded-lg ml-2  hover:bg-gray-600"
          onClick={saveRequest}
        >
          Guardar
        </button>
      </div>

      <BodyResponse
        response={responseRequest}
        typeRequest={method}
        changeParams={changeParams}
        changeJsonBody={changeJsonBody}
        changeTypeBody={changeTypeBody}
        changeFormBody={changeFormBody}
        clearResponse={clearResponse}
        changeAuth={changeAuth}
        typeBody={typeBodyRequest}
        acTab={activeTab}
        changeTab={changeTab}
        isLoading={isLoading}
      ></BodyResponse>
      {/* {jsonBodyRequest && (
        <div className="mt-5 bg-black p-5 rounded-lg">
          <pre>{JSON.stringify(jsonBodyRequest, null, 2)}</pre>
        </div>
      )} */}
    </div>
  );
}

export default Content;
