import { useDispatch } from "react-redux";
import { Handle, Position, useNodeId, useReactFlow, useNodes } from "reactflow";
import {
  clearFormData,
  setDrawerOpen,
  setSelectedNodeId,
  setSelectedNodeType,
} from "store/action/journeyCanvas";
import Icon from "@mdi/react";
import { mdiCloseThick, mdiEmailOutline } from "@mdi/js";
import "./Style.scss";
import { useState } from "react";
import { TextField } from "@mui/material";

export const SendEmailNode = () => {
  const nodeId = useNodeId();
  const nodes = useNodes();
  const dispatch = useDispatch();
  const { setNodes, setEdges } = useReactFlow();

  const handleClick = () => {
    dispatch(setDrawerOpen(true));
    dispatch(setSelectedNodeType("send_email"));
    dispatch(setSelectedNodeId(nodeId));
  };
  const [isConnectable, setIsConnectable] = useState(true);

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
  const handleChangeNodeName = (e) => {
    const newName = e.target.value;
    console.log("New name:", newName);
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, nodeName: newName } }
          : node
      )
    );
    console.log("updated nodse", nodes);
  };

  return (
    <>
      <div className="NodeWrapper">
        <Handle type="target" position={Position.Top} className="NodePort" />
        <div
          onClick={handleClick}
          style={{ position: "relative" }}
          className="node_design_wrapper"
        >
          <div className="icon_design">
            <Icon path={mdiEmailOutline} size={1.7} />
          </div>
          <div
            style={{
              position: "absolute",
              top: "-22%",
              left: "93.5%",
            }}
          >
            <Icon
              onClick={handleDeleteNode}
              color="red"
              path={mdiCloseThick}
              size={1}
            />
          </div>
          <div className="node_info">
            {/* <div className="NodeTitle">Email</div> */}
            <TextField
              id="outlined-select-currency-native"
              fullWidth
              // label="Contact Node"
              value={nodes.find((node) => node.id === nodeId)?.data?.nodeName}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
              }}
              onChange={(e) => handleChangeNodeName(e)}
              className="NodeTitle"
              autoComplete="off"
            ></TextField>
            <p className="NodeDesc">Email Related Content</p>
          </div>
        </div>
        <Handle
          type="source"
          position={Position.Bottom}
          className="NodePort"
          isConnectable={isConnectable}
        />
        <div className="handleWrapper">
          <div className="handleNodes">
            <Handle
              type="source"
              className="handleActionNodes"
              position={Position.Bottom}
              id={`${nodeId}-onSend`}
              style={{ bottom: -13 }}
              isConnectable={isConnectable}
            />
            <h6>Send</h6>
          </div>
          <div className="handleNodes">
            <Handle
              type="source"
              className="handleActionNodes"
              position={Position.Bottom}
              id={`${nodeId}-onOpen`}
              label="On Open"
              style={{ bottom: -13 }}
              isConnectable={isConnectable}
            />
            <h6>Open</h6>
          </div>
          <div className="handleNodes">
            <Handle
              type="source"
              position={Position.Bottom}
              id={`${nodeId}-onClick`}
              className="handleActionNodes"
              style={{ bottom: -13 }}
              isConnectable={isConnectable}
            />
            <h6>Click</h6>
          </div>
          <div className="handleNodes">
            <Handle
              type="source"
              position={Position.Bottom}
              id={`${nodeId}-onUnsubscribe`}
              className="handleActionNodes"
              style={{ bottom: -13 }}
              isConnectable={isConnectable}
            />
            <h6>Unsubscribe</h6>
          </div>
          <div className="handleNodes">
            <Handle
              type="source"
              position={Position.Bottom}
              id={`${nodeId}-onBounce`}
              className="handleActionNodes"
              style={{ bottom: -13 }}
              isConnectable={isConnectable}
            />
            <h6>Bounce</h6>
          </div>
        </div>
      </div>

      {/* <div className="NodeWrapper">
     <Handle type="target" position={Position.Top} className="NodePort" />
        <div onClick={handleClick} className="node_design_wrapper">
            <div className="icon_design"><Icon path={mdiEmailOutline} size={1.7} /></div>
            <div className="node_info">
                <div className="NodeTitle">Email</div>
                <p className="NodeDesc">Email Related Content</p>
            </div>
        </div>
        <Handle type="source" position={Position.Bottom} className="NodePort" isConnectable={isConnectable} />
        <div className="handleWrapper">
                <div className="handleNodes">
                    <Handle
                        type="source"
                        className="handleActionNodes"
                        position={Position.Bottom}
                        id="onSend"
                        style={{ bottom: -13 }}
                        isConnectable={isConnectable}
                    />
                    <h6>Send</h6>
                </div>
                <div className="handleNodes">
                    <Handle
                        type="source"
                        className="handleActionNodes"
                        position={Position.Bottom}
                        id="onOpen"
                        style={{ bottom: -13 }}
                        isConnectable={isConnectable}
                    />
                    <h6>Open</h6>
                </div>
                <div className="handleNodes">
                    <Handle
                        type="source"
                        position={Position.Bottom}
                        id="onClick"
                        className="handleActionNodes"
                        style={{ bottom: -13 }}
                        isConnectable={isConnectable}
                    />
                    <h6>Click</h6>
                </div>
                <div className="handleNodes">
                    <Handle
                        type="source"
                        position={Position.Bottom}
                        id="onUnsubscribe"
                        className="handleActionNodes"
                        style={{ bottom: -13 }}
                        isConnectable={isConnectable}
                    />
                    <h6>Unsubscribe</h6>
                </div>
                <div className="handleNodes">
                    <Handle
                        type="source"
                        position={Position.Bottom}
                        id="onBounce"
                        className="handleActionNodes"
                        style={{ bottom: -13 }}
                        isConnectable={isConnectable}
                    />
                    <h6>Bounce</h6>
                </div>
            </div>
     </div> */}
    </>
  );
};
