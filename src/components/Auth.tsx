import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
function Auth({ changeAuth }) {
  const requestCurrentValue = useSelector(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    (state) => state.requestCurrent.requestCurrent
  );
  const [authType, setAuthType] = useState(
    requestCurrentValue && requestCurrentValue.authData
      ? requestCurrentValue.authData.type
        ? requestCurrentValue.authData.type
        : "None"
      : "None"
  );

  const [formData, setFormData] = useState(
    requestCurrentValue && requestCurrentValue.authData
      ? requestCurrentValue.authData
      : {
          username: "",
          password: "",
          token: "",
          apiKey: "",
          type: "None",
        }
  );

  useEffect(() => {
    changeAuth(formData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const handleAuthTypeChange = (e) => {
    const selectedType = e.target.value;
    setAuthType(selectedType);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    setFormData((prevData) => ({
      ...prevData,
      type: selectedType,
    }));
  };

  const renderForm = () => {
    switch (authType) {
      case "BasicAuth":
        return (
          <div className="mt-4">
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              type="text"
              className="bg-black border-none bg-opacity-10 text-sm rounded-lg block w-full p-2 mb-4"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Usuario"
              name="username"
            />
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              name="password"
              onChange={handleInputChange}
              className="bg-black border-none bg-opacity-10 text-sm rounded-lg block w-full p-2 mb-4"
              placeholder="Contraseña"
            />
          </div>
        );
      case "BearerToken":
        return (
          <div className="mt-4">
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Token
            </label>
            <input
              type="text"
              name="token"
              value={formData.token}
              onChange={handleInputChange}
              className="bg-black border-none bg-opacity-10 text-sm rounded-lg block w-full p-2 mb-4"
              placeholder="Ingresa tu TOKEN"
            />
          </div>
        );
      case "APIKey":
        return (
          <div className="mt-4">
            <label className="block mb-2 text-sm font-medium text-gray-300">
              API Key
            </label>
            <input
              type="text"
              name="apiKey"
              value={formData.apiKey}
              onChange={handleInputChange}
              className="bg-black border-none bg-opacity-10 text-sm rounded-lg block w-full p-2 mb-4"
              placeholder="Ingresa API Key"
            />
          </div>
        );
      case "None":
      default:
        return null;
    }
  };

  return (
    <div className="mt-3 px-2">
      <select
        className="border-none text-sm rounded-lg block w-[10vw] p-2 bg-transparent mb-5"
        value={authType}
        onChange={handleAuthTypeChange}
      >
        <option className="bg-black" value="None">
          None
        </option>
        <option className="bg-black" value="BasicAuth">
          Basic Auth
        </option>
        <option className="bg-black" value="BearerToken">
          Bearer Token
        </option>
        <option className="bg-black" value="APIKey">
          API Key
        </option>
      </select>

      {renderForm()}
    </div>
  );
}

export default Auth;
