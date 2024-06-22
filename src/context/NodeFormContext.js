import App from "App";
import React, { useState } from "react";
import { Automation } from "views/react-email-flow/Automation";
// import App from "App";
// import { ReactEmailFlow} from "views/react-email-flow/ReactEmailFlow"
export const multiFormNodeContext = React.createContext();

const  NodeFormContext = ({children}) => {

  const [currentFormNode, setCurrentFormNode] = useState("");
  const [formDataFlow, setFormDataFlow] = useState([]);
  const [finalFormData, setFinalFormData] = useState([]);

  function submitData(){

    // console.log(finalFormData)
    // debugger;
  }

  return (
    <div>
        <multiFormNodeContext.Provider value={{currentFormNode,setCurrentFormNode,formDataFlow,setFormDataFlow,finalFormData,setFinalFormData,submitData}}>
            {/* <Automation/> */}
            {/* <App/> */}
            {children}
        </multiFormNodeContext.Provider>
    </div>
  )
}

export default NodeFormContext;
