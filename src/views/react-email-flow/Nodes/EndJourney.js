import { useDispatch, useSelector } from "react-redux";
import { Handle, Position, useNodeId, useReactFlow } from "reactflow";
import {
  deleteNode,
  setDrawerOpen,
  setSelectedNodeId,
  setSelectedNodeType,
} from "store/action/journeyCanvas";
import Icon from "@mdi/react";
import { mdiClockStart, mdiCloseThick, mdiStopCircleOutline } from "@mdi/js";
import "./Style.scss";
import { selectGetNodes } from "store/selectors";
import { useState } from "react";

export const EndJourney = () => {
  const nodeId = useNodeId();
  const nodes = useSelector(selectGetNodes);
  const dispatch = useDispatch();
  const { setNodes, setEdges } = useReactFlow();
  const handleClick = () => {
    // dispatch(setDrawerOpen(true));
    dispatch(setSelectedNodeType("begin_journey"));
    dispatch(setSelectedNodeId(nodeId));
  };
  const [isConnectable, setIsConnectable] = useState(true);
  // const handleDeleteNode = (nodeId) => {
  //   dispatch(deleteNode(nodeId));
  // };
  const handleDeleteNode = (event) => {
    console.log("delete called");
    console.log(nodeId);
    setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
    setEdges((edges) => edges.filter((edge) => edge.source !== nodeId));
    event.stopPropagation();
  };
  return (
    <>
      <div className="NodeWrapper" aria-disabled={true}>
      <Handle type="target" position={Position.Top} className="NodePort" />
        <div
          onClick={handleClick}
          className="NodeInnerWrapper"
          aria-disabled={true}
        >
          <div className="icon_design">
            <Icon path={mdiStopCircleOutline} size={1.7} />
          </div>
          <div
            style={{
              position: "absolute",
              top: "-20%",
              left: "95% ",
            }}
            // className="node_delete_icon"
          >
            {/* <Icon
              onClick={handleDeleteNode}
              color="red"
              path={mdiCloseThick}
              size={1}
            /> */}
          </div>
          <div className="node_info">
            <div className="NodeTitle">End Journey</div>
            <p className="NodeDesc">End Journey Related Content</p>
          </div>
        </div>
      </div>
    </>
  );
};
