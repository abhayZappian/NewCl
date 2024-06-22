import { useDispatch } from 'react-redux';
import { Handle, Position, useNodeId, useReactFlow } from 'reactflow';
import { clearFormData, setDrawerOpen, setSelectedNodeId, setSelectedNodeType } from 'store/action/journeyCanvas';
import Icon from '@mdi/react';
import { mdiCloseThick, mdiEmailOutline } from '@mdi/js';
import './Style.scss';
import { useState } from 'react';

export const IsIn = () => {
    const nodeId = useNodeId();
    const dispatch = useDispatch();
    const { setNodes, setEdges } = useReactFlow();

    const handleClick = () => {
        dispatch(setDrawerOpen(true));
        dispatch(setSelectedNodeType('is_in'));
        dispatch(setSelectedNodeId(nodeId));
    };
    const [isConnectable, setIsConnectable] = useState(true);

    const handleDeleteNode = (event) => {
        console.log('delete called');
        console.log(nodeId);
           dispatch(clearFormData(nodeId));

        setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
        // setEdges((edges) => edges.filter((edge) => edge.source !== nodeId));
         setEdges((edges) =>
           edges.filter(
             (edge) => edge.source !== nodeId && edge.target !== nodeId
           )
         );
        event.stopPropagation();
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
              <div className="NodeTitle">Is in</div>
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
            <div className="handleNodes">
              <Handle
                type="source"
                className="handleActionNodes"
                position={Position.Bottom}
                id={`${nodeId}-isInYes`}
                style={{ bottom: -13 }}
                isConnectable={isConnectable}
              />
              <h6>Yes</h6>
            </div>
            <div className="handleNodes">
              <Handle
                type="source"
                className="handleActionNodes"
                position={Position.Bottom}
                id={`${nodeId}-isInNo`}
                style={{ bottom: -13 }}
                isConnectable={isConnectable}
              />
              <h6>No</h6>
            </div>
          </div>
        </div>
      </>
    );
};
