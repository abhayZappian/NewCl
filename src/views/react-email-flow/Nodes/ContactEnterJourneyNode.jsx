import { useDispatch } from "react-redux";
import { Handle, Position, useNodeId, useReactFlow } from "reactflow";
import {
  clearFormData,
  setDrawerOpen,
  setSelectedNodeId,
  setSelectedNodeType,
} from "store/action/journeyCanvas";
import Icon from "@mdi/react";
import { mdiCloseThick, mdiLocationEnter } from "@mdi/js";
import "./Style.scss";
import { useState } from "react";

export const ContactEnterJourneyNode = () => {
  const nodeId = useNodeId();
  const dispatch = useDispatch();
  const [isConnectable, setIsConnectable] = useState(true);
  const { setNodes, setEdges } = useReactFlow();

  const handleClick = () => {
    dispatch(setDrawerOpen(true));
    dispatch(setSelectedNodeType("contact_enters_journey"));
    dispatch(setSelectedNodeId(nodeId));
  };
  const handleDeleteNode = (event) => {
    console.log("delete called");
    console.log(nodeId);
    dispatch(clearFormData(nodeId));
    setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
    // setEdges((edges) => edges.filter((edge) => edge.source !== nodeId));
     setEdges((edges) =>
       edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
     );
  
    event.stopPropagation();
  };
  return (
    <>
      <div className="NodeWrapper">
        <Handle
          type="target"
          position={Position.Top}
          className="NodePort"
          isConnectable={isConnectable}
        />
        <div onClick={handleClick} className="node_design_wrapper">
          <div className="icon_design">
            <Icon path={mdiLocationEnter} size={1.7} />
          </div>
          <div style={{ position: "absolute", top: "-20%", left: "95.5%" }}>
            <Icon
              onClick={handleDeleteNode}
              color="red"
              path={mdiCloseThick}
              size={1}
            />
          </div>
          <div className="node_info">
            <div className="NodeTitle">Contact Node</div>
            <p className="NodeDesc">Contact Enter Journey Related Content</p>
          </div>
        </div>
        <Handle
          type="source"
          position={Position.Bottom}
          className="NodePort"
          isConnectable={isConnectable}
        />
      </div>
    </>
  );
};
