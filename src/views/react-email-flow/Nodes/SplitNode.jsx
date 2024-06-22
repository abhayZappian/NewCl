import { useDispatch, useSelector } from "react-redux";
import { Handle, Position, useNodeId, useReactFlow } from "reactflow";
import {
  clearFormData,
  setDrawerOpen,
  setSelectedNodeId,
  setSelectedNodeType,
  setSplitBranchName,
} from "store/action/journeyCanvas";
import Icon from "@mdi/react";
import { mdiCloseThick, mdiEmailOutline } from "@mdi/js";
import "./Style.scss";
import { useState } from "react";
import store from "store";

export const SplitNode = () => {
  const nodeId = useNodeId();
  const dispatch = useDispatch();
  const { setNodes, setEdges } = useReactFlow();

  const handleClick = () => {
    dispatch(setDrawerOpen(true));
    dispatch(setSelectedNodeType("split"));
    dispatch(setSelectedNodeId(nodeId));
  };
  const [isConnectable, setIsConnectable] = useState(true);

  const handleDeleteNode = (event) => {
    console.log("delete called");
    console.log(nodeId);
    dispatch(setSplitBranchName([]));
    dispatch(clearFormData(nodeId));
    setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
    // setEdges((edges) => edges.filter((edge) => edge.source !== nodeId));
    setEdges((edges) =>
      edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
    event.stopPropagation();
  };
  const a = ["abhay", "mohan"];
  const initialSplitBrancName = useSelector(
    (store) => store.journeyCanvas.splitBranchName
  );
  console.log(initialSplitBrancName, "orrr");
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
            <div className="NodeTitle">split</div>
            <p className="NodeDesc">Description for Email Mobile</p>
          </div>
        </div>
        <Handle
          type="source"
          position={Position.Bottom}
          className="NodePort"
          isConnectable={isConnectable}
        />
        <div className="handleWrapper">
          {/* {initialSplitBrancName.length === 0 && (
            <div className="handleNodes">
              <Handle
                type="source"
                className="handleActionNodes"
                position={Position.Bottom}
                id={`${nodeId}-Branch1`}
                style={{ bottom: -13 }}
                isConnectable={isConnectable}
              />
              <h6>Branch 1</h6>
            </div>
          )} */}
          {initialSplitBrancName.length === 1 && (
            <>
              <div className="handleNodes">
                <Handle
                  type="source"
                  className="handleActionNodes"
                  position={Position.Bottom}
                  id={`${nodeId}-Branch1`}
                  style={{ bottom: -13 }}
                  isConnectable={isConnectable}
                />
                <h6>Branch 1</h6>
              </div>
            </>
          )}
          {initialSplitBrancName.length === 2 && (
            <>
              <div className="handleNodes">
                <Handle
                  type="source"
                  className="handleActionNodes"
                  position={Position.Bottom}
                  id={`${nodeId}-Branch1`}
                  style={{ bottom: -13 }}
                  isConnectable={isConnectable}
                />
                <h6>Branch 1</h6>
              </div>
              <div className="handleNodes">
                <Handle
                  type="source"
                  className="handleActionNodes"
                  position={Position.Bottom}
                  id={`${nodeId}-Branch2`}
                  style={{ bottom: -13 }}
                  isConnectable={isConnectable}
                />
                <h6>Branch 2</h6>
              </div>
            </>
          )}
          {initialSplitBrancName.length === 3 && (
            <>
              <div className="handleNodes">
                <Handle
                  type="source"
                  className="handleActionNodes"
                  position={Position.Bottom}
                  id={`${nodeId}-Branch1`}
                  style={{ bottom: -13 }}
                  isConnectable={isConnectable}
                />
                <h6>Branch 1</h6>
              </div>
              <div className="handleNodes">
                <Handle
                  type="source"
                  className="handleActionNodes"
                  position={Position.Bottom}
                  id={`${nodeId}-Branch2`}
                  style={{ bottom: -13 }}
                  isConnectable={isConnectable}
                />
                <h6>Branch 2</h6>
              </div>
              <div className="handleNodes">
                <Handle
                  type="source"
                  className="handleActionNodes"
                  position={Position.Bottom}
                  id={`${nodeId}-Branch3`}
                  style={{ bottom: -13 }}
                  isConnectable={isConnectable}
                />
                <h6>Branch 3</h6>
              </div>
            </>
          )}
          {initialSplitBrancName.length === 4 && (
            <>
              <div className="handleNodes">
                <Handle
                  type="source"
                  className="handleActionNodes"
                  position={Position.Bottom}
                  id={`${nodeId}-Branch1`}
                  style={{ bottom: -13 }}
                  isConnectable={isConnectable}
                />
                <h6>Branch 1</h6>
              </div>
              <div className="handleNodes">
                <Handle
                  type="source"
                  className="handleActionNodes"
                  position={Position.Bottom}
                  id={`${nodeId}-Branch2`}
                  style={{ bottom: -13 }}
                  isConnectable={isConnectable}
                />
                <h6>Branch 2</h6>
              </div>
              <div className="handleNodes">
                <Handle
                  type="source"
                  className="handleActionNodes"
                  position={Position.Bottom}
                  id={`${nodeId}-Branch3`}
                  style={{ bottom: -13 }}
                  isConnectable={isConnectable}
                />
                <h6>Branch 3</h6>
              </div>
              <div className="handleNodes">
                <Handle
                  type="source"
                  className="handleActionNodes"
                  position={Position.Bottom}
                  id={`${nodeId}-Branch4`}
                  style={{ bottom: -13 }}
                  isConnectable={isConnectable}
                />
                <h6>Branch 4</h6>
              </div>
            </>
          )}
          {initialSplitBrancName.length === 5 && (
            <>
              <div className="handleNodes">
                <Handle
                  type="source"
                  className="handleActionNodes"
                  position={Position.Bottom}
                  id={`${nodeId}-Branch1`}
                  style={{ bottom: -13 }}
                  isConnectable={isConnectable}
                />
                <h6>Branch 1</h6>
              </div>
              <div className="handleNodes">
                <Handle
                  type="source"
                  className="handleActionNodes"
                  position={Position.Bottom}
                  id={`${nodeId}-Branch2`}
                  style={{ bottom: -13 }}
                  isConnectable={isConnectable}
                />
                <h6>Branch 2</h6>
              </div>
              <div className="handleNodes">
                <Handle
                  type="source"
                  className="handleActionNodes"
                  position={Position.Bottom}
                  id={`${nodeId}-Branch3`}
                  style={{ bottom: -13 }}
                  isConnectable={isConnectable}
                />
                <h6>Branch 3</h6>
              </div>
              <div className="handleNodes">
                <Handle
                  type="source"
                  className="handleActionNodes"
                  position={Position.Bottom}
                  id={`${nodeId}-Branch4`}
                  style={{ bottom: -13 }}
                  isConnectable={isConnectable}
                />
                <h6>Branch 4</h6>
              </div>
              <div className="handleNodes">
                <Handle
                  type="source"
                  className="handleActionNodes"
                  position={Position.Bottom}
                  id={`${nodeId}-Branch5`}
                  style={{ bottom: -13 }}
                  isConnectable={isConnectable}
                />
                <h6>Branch 5</h6>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
