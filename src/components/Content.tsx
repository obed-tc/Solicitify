import { useState } from "react";

function Content() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [response, setResponse] = useState("");
  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMethod(e!.target.value);
  };
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e!.target.value);
  };
  const submitRequest = async () => {
    try {
      const response = await fetch(url, { method });
      console.log(response);
      const responseData = await response.json();
      setResponse(responseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <div className="px-10">
      {method}
      {url}
      <div className="flex items-center ">
        <select
          name="select"
          value={method}
          onChange={handleMethodChange}
          className="bg-black px-5 py-3"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>
        <input
          className="bg-black w-full text-lg px-5 py-3"
          placeholder="Ingrese la url o pega el texto"
          value={url}
          onChange={handleUrlChange}
        />
        <button
          className="bg-green-500 px-5 py-2 rounded-lg"
          onClick={submitRequest}
        >
          Enviar
        </button>
      </div>
      {response && (
        <div className="mt-5 bg-black p-5 rounded-lg">
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default Content;
