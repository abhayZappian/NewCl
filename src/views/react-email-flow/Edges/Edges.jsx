import "./Style.scss";
import {
  getEdgeCenter,
  getBezierPath,
  getMarkerEnd,
} from "react-flow-renderer";
import React, { memo } from "react";
import Icon from "@mdi/react";
import { mdiCloseThick } from "@mdi/js";
import { useReactFlow } from "reactflow";
import { EdgeText } from "reactflow";

const [buttonWidth, buttonHeight] = [25, 25];
//  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
const Edge = memo(
  ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style,
    arrowHeadType,
    markerEndId,
    data,
    onDelete,
  }) => {
    const edgePath = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
    const { setEdges } = useReactFlow();
    const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
    const [edgeCenterX, edgeCenterY] = getEdgeCenter({
      sourceX,
      sourceY,
      targetX,
      targetY,
    });
    const foreignObjectSize = 25;

    // const handleDeleteClick = () => {

    //   if (data && typeof data?.onDelete === "function") {
    //     data.onDelete(id);
    //   } else {
    //     console.error("onDelete function is not defined or not a function");
    //   }

    // };

    return (
      <>
        <path
          id={id}
          style={style}
          className="react-flow__edge-path"
          d={edgePath}
          markerEnd={markerEnd}
        />
        {/* <text dy={-5} > */}
        {/* <textPath */}
        {/* // href={`#${id}`} */}
        {/* // style={{ fontSize: "12px" }} */}
        {/* // startOffset="50%" */}
        {/* // textAnchor="middle" */}
        {/* //   > */}
        {/* {data.text} */}
        {/* </textPath> */}
        {/* </text> */}
        <EdgeText x={edgeCenterX} y={edgeCenterY} label={data.text} />
        <foreignObject
          width={foreignObjectSize}
          height={foreignObjectSize}
          x={edgeCenterX - foreignObjectSize / 2}
          y={edgeCenterY - foreignObjectSize / 2}
          className="edgebutton-foreignobject"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <div>
            <Icon
              //   onClick={() => data.onDelete(id)}
              // onClick={handleDeleteClick}
              onClick={() =>
                setEdges((edges) => edges.filter((e) => e.id !== id))
              }
              color="red"
              path={mdiCloseThick}
              size={1}
            />
          </div>
        </foreignObject>
      </>
    );
  }
);

export default Edge;
