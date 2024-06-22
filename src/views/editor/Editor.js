import React, { useRef } from "react";
import AceEditor from "react-ace";
import ReactDOM from "react-dom";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/snippets/html";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-min-noconflict/ext-spellcheck";
import "ace-builds/webpack-resolver";
import { Box } from "@mui/material";

const Editor = () => { 
  const aceEditorRef = useRef();
  const myRef = useRef();

  const onEditorChange = (newValue) => {
    ReactDOM.findDOMNode(myRef.current).innerHTML = newValue;
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100VW",
        overflowY: "scroll",
        overflowX: "hidden",
      }}
    >
      {/* editor */}
      <Box
        sx={{
          width: "50%",
        }}
      >
        <AceEditor
          mode="html"
          theme="monokai"
          name="awesome-code"
          height="100%"
          width="100%"
          ref={aceEditorRef}
          onChange={onEditorChange}
          fontSize={14}
          showPrintMargin={true}
          focus={true}
          editorProps={{ $blockScrolling: true }}
          wrapEnabled={true}
          // cursorStart={4}
          highlightActiveLine={true}
          autoScrollEditorIntoView={true}
          value={`<html>\n\t<body>\n\t</body>\n</html>`}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
            showGutter: true,
          }}
        />
      </Box>
      {/* output */}
      <Box
        ref={myRef}
        sx={{
          overflow: "auto",
          width: "50%",
          height: "100%",
        }}
      ></Box>
    </Box>
  );
};

export default Editor;
