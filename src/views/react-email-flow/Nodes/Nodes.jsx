import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { BaseNode, EmptyBaseNode } from "./Base";
import "./Style.scss";

const handleNodeClick = (props) => {
  const { data, id } = props;
  data.onNodeClickCallback(id);
};

const onCloseIconClick = (event, props) => {
  // debugger;
  event.stopPropagation();
  const { data, id } = props;

  // data.onDeleteNodeCallback(id);
};
export const WaitForDate = (props) => {
  console.log(props);
  let [isConnectable, setIsConnectable] = useState(true);
  return (
    <>
      <div className="NodeWrapper">
        <Handle type="target" position={Position.Top} className="NodePort" />
        <BaseNode
          {...props}
          // onNodeClick={() => handleNodeClick(props)}
          // onCloseIconClick={(event) => onCloseIconClick(event, props)}
        />

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
              id="onDate"
              style={{ bottom: -13 }}
              isConnectable={isConnectable}
            />
            <h6>on Date</h6>
          </div>
          <div className="handleNodes">
            <Handle
              type="source"
              className="handleActionNodes"
              position={Position.Bottom}
              id="OnWindowMissout"
              style={{ bottom: -13 }}
              isConnectable={isConnectable}
            />
            <h6>On Window Missout</h6>
          </div>
        </div>
      </div>
    </>
  );
};
export const HandleMailTemplate = (props) => {
  console.log(props);
  const [isConnectable, setIsConnectable] = useState(true);
  return (
    <div className="NodeWrapper">
      <Handle type="target" position={Position.Top} className="NodePort" />
      <BaseNode
        {...props}
        // onNodeClick={() => handleNodeClick(props)}
        onCloseIconClick={(event) => onCloseIconClick(event, props)}
      />

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
    </div>
  );
};

export const Source = (props) => (
  <div className="NodeWrapper">
    <BaseNode
      {...props}
      // onNodeClick={() => handleNodeClick(props)}
      onCloseIconClick={(event) => onCloseIconClick(event, props)}
    />
    <Handle type="source" position={Position.Bottom} className="NodePort" />
  </div>
);
export const Action = (props) => (
  <div className="NodeWrapper">
    {/* <button onClick={props.data.onChange}>msadnmsakdns</button> */}
    <Handle type="target" position={Position.Top} className="NodePort" />
    <BaseNode
      {...props}
      // onNodeClick={() => handleNodeClick(props)}
      onCloseIconClick={(event) => onCloseIconClick(event, props)}
    />
    <Handle type="source" position={Position.Bottom} className="NodePort" />
  </div>
);

export const Condition = (props) => (
  <div className="NodeWrapper">
    <Handle type="target" position={Position.Top} className="NodePort" />
    <BaseNode
      {...props}
      additionalClassName="ConditionNode"
      // onNodeClick={() => handleNodeClick(props)}
      onCloseIconClick={(event) => onCloseIconClick(event, props)}
    />
    <Handle
      id="condition_0"
      type="source"
      position={Position.Bottom}
      className="NodePort"
    />
    <Handle
      id="condition_1"
      type="source"
      position={Position.Bottom}
      className="NodePort"
    />
  </div>
);

export const End = (props) => (
  <div className="NodeWrapper">
    <Handle type="target" position={Position.Top} className="NodePort" />
    <BaseNode
      {...props}
      disabled={true}
      onCloseIconClick={(event) => onCloseIconClick(event, props)}
    />
  </div>
);

export const Empty = (props) => (
  <div className="NodeWrapper">
    <Handle
      type="target"
      position={Position.Top}
      className="NodePort"
      // style={{ opacity: 0 }}
    />
    <EmptyBaseNode {...props} disabled={true} />
    <Handle
      type="source"
      position={Position.Bottom}
      className="NodePort"
      style={{ opacity: 0 }}
    />
  </div>
);

// export const dropZone = (props) => (
//     <div className="NodeWrapper">
//         <BaseNode
//             {...props}
//             onNodeClick={() => handleNodeClick(props)}
//             onCloseIconClick={(event) => onCloseIconClick(event, props)}
//         />
//         <Handle type="drop" position={Position.Bottom} className="NodePort" />
//     </div>
// );
