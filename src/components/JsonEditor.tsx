import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
const JsonEditor = ({ changeJsonBody }) => {
  const requestCurrentValue = useSelector(
    (state) => state.requestCurrent.requestCurrent
  );
  const [jsonText, setJsonText] = useState(
    requestCurrentValue ? requestCurrentValue.jsonBodyRequest : ""
  );

  useEffect(() => {
    if (requestCurrentValue != null) {
      setJsonText(requestCurrentValue.jsonBodyRequest);
    }
  }, [requestCurrentValue]);
  const textareaRef = useRef(null);
  useEffect(() => {
    const formatedTexto = formatJson(jsonText);
    changeJsonBody(formatedTexto.data);
  }, [jsonText]);
  const handleChange = (event) => {
    setJsonText(event.target.value);
  };
  const formatJson = (text) => {
    try {
      const obj = JSON.parse(text);
      const formattedJson = JSON.stringify(obj, null, 2);
      const isAlreadyFormatted = text.trim() === formattedJson.trim();
      return { isFormatted: isAlreadyFormatted, data: formattedJson };
    } catch (e) {
      return { isFormatted: false, data: text };
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      const cursorPosition = event.target.selectionStart;
      const currentText = jsonText;

      const beforeCursor = currentText.slice(0, cursorPosition);
      const afterCursor = currentText.slice(cursorPosition);

      const openBraceCountBefore = (beforeCursor.match(/{/g) || []).length;
      const closeBraceCountBefore = (beforeCursor.match(/}/g) || []).length;
      const openBraceCountAfter = (afterCursor.match(/{/g) || []).length;
      const closeBraceCountAfter = (afterCursor.match(/}/g) || []).length;

      const totalOpen = openBraceCountBefore + openBraceCountAfter;
      const totalClose = closeBraceCountBefore + closeBraceCountAfter;

      if (totalOpen > totalClose) {
        const newText = `${beforeCursor}\n  ${afterCursor}`;
        const addClosingBrace = totalClose < totalOpen;

        if (addClosingBrace) {
          setJsonText(`${newText}\n}`);
          setTimeout(() => {
            textareaRef.current.selectionStart = cursorPosition + 3;
            textareaRef.current.selectionEnd = cursorPosition + 3;
          }, 0);
        } else {
          setJsonText(newText);
          setTimeout(() => {
            textareaRef.current.selectionStart = cursorPosition + 2;
            textareaRef.current.selectionEnd = cursorPosition + 2;
          }, 0);
        }
      } else {
        if (afterCursor.includes("}")) {
          const newText = `${beforeCursor}\n  ${afterCursor}`;

          setJsonText(newText);

          setTimeout(() => {
            textareaRef.current.selectionStart = cursorPosition + 3;
            textareaRef.current.selectionEnd = cursorPosition + 3;
          }, 0);
        } else {
          const newText = `${beforeCursor}${afterCursor}`;
          const formatnew = formatJson(newText);
          if (formatnew.isFormatted == false) {
            setJsonText(formatnew.data + "\n");
            setTimeout(() => {
              textareaRef.current.selectionStart = cursorPosition + 4;
              textareaRef.current.selectionEnd = cursorPosition + 4;
            }, 0);
          } else {
            setJsonText(newText + "\n");
            setTimeout(() => {
              textareaRef.current.selectionStart = cursorPosition + 1;
              textareaRef.current.selectionEnd = cursorPosition + 1;
            }, 0);
          }
        }
      }
    }
  };
  const getLineNumbers = () => {
    const lines = jsonText.split("\n").length;
    return Array.from({ length: lines }, (_, index) => index + 1);
  };

  return (
    <div className="rounded-lg shadow-md h-[50vh] overflow-auto">
      <div className="flex ">
        <div className="text-right text-gray-400 pr-1 py-2 flex flex-col">
          {getLineNumbers().map((item) => (
            <div className="text-xs py-1">{item}</div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          value={jsonText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={10}
          className="w-full p-2 border-none rounded-lg resize-none focus:outline-none focus:ring-0 focus:ring-blue-500 bg-transparent text-white"
          placeholder=""
        />
      </div>
    </div>
  );
};

export default JsonEditor;
