import React, { useCallback, useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactFlow, {
  Controls,
  MiniMap,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  Background,
  useNodeId,
} from "reactflow";
import "./Automation.css";
import { nodeTypes } from "./Nodes/index.jsx";
import { Box, Button, Grid, Input } from "@mui/material";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import {
  selectBeginNode,
  selectEndNode,
  selectGetAllFormData,
  selectGetEdges,
  selectGetEmailSchedule,
  selectGetFormData,
  selectGetJourneyName,
  selectGetNodes,
  selectJourneyId,
} from "store/selectors/index.js";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import {
  setBeginNode,
  setEndNode,
  setJourneyName,
  setSelectedNodeId,
  setSelectedNodeType,
} from "store/action/journeyCanvas";
import { useNavigate } from "react-router-dom";
import { baseURL } from "config/envConfig";
import { useNodeInfo } from "hooks/useNodeInfo";
import { setDrawerOpen } from "store/action/journeyCanvas";
import axiosInstance from "helpers/apiService";
import { v4 as uuidv4 } from "uuid";
import { checkJourneyValidOrNot } from "utils/Validations";
import apiEndPoints from "helpers/APIEndPoints";
import Edge from "./Edges/Edges";

export const Automation = (props) => {
  const dispatch = useDispatch();

  const location = useLocation();

  const { state } = location;

  const intialFormData = useSelector(selectGetFormData) || {};

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [edgeCounter, setEdgeCounter] = useState(0);

  const navigateToListFlow = () => {
    navigate("/");
  };
  const flowKey = "cl-flow";
  const reactFlowWrapper = useRef(null);
  const initNodes = useSelector(selectGetNodes);
  const initEdges = useSelector(selectGetEdges);
  const journeyName = useSelector(selectGetJourneyName);
  const schedule = useSelector(selectGetEmailSchedule);
  const journeyId = useSelector(selectJourneyId);
  const initialEndNode = useSelector(selectEndNode);
  const initialBeginNode = useSelector(selectBeginNode);
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const edgeTypes = {
    custom: Edge,
  };

  const validConnections = {
    begin_journey: ["contact_enters_journey", "wait_for"],
    contact_enters_journey: [
      "send_email",
      "is_in",
      "has_done",
      "if_this_happens",
      "wait_for",
      "call_api_webhook",
      "user_attributes",
      "split",
    ],
    event_occurs: [
      "send_email",
      "call_api_webhook",
      "add_data_to_field",
      "add_to_list",
      "is_in",
      "has_done",
      "user_attributes",
      "if_this_happens",
      "wait_for",
      "end_journey",
    ],
    send_email: [
      "wait_for",
      "send_email",
      // 'event_occurs',
      "call_api_webhook",
      "add_data_to_field",
      "add_to_list",
      "is_in",
      "end_journey",
      // "has_done",
      "if_this_happens",
    ],
    call_api_webhook: ["end_journey", "call_api_webhook", "send_email"],
    add_to_list: ["end_journey", "send_email"],
    add_data_to_field: ["end_journey", "add_data_to_field"],
    is_in: [
      "send_email",
      "call_api_webhook",
      "add_to_list",
      "add_data_to_field",
      "wait_for",
      "end_journey",
    ],
    has_done: [
      "send_email",
      "call_api_webhook",
      "add_to_list",
      "add_data_to_field",
      "wait_for",
      "end_journey",
    ],
    if_this_happens: ["call_api_webhook", "end_journey"],
    wait_for: [
      "send_email",
      "call_api_webhook",
      "add_to_list",
      "add_data_to_field",
      "event_occurs",
      "has_done",
    ],
    user_attributes: [
      "send_email",
      "call_api_webhook",
      "add_to_list",
      "add_data_to_field",
      "wait_for",
      "end_journey",
      "split",
    ],
    split: [
      "send_email",
      "call_api_webhook",
      "add_to_list",
      "add_data_to_field",
      "wait_for",
    ],
  };
  const validateConnection = (sourceType, targetType) => {
    return (
      validConnections[sourceType] &&
      validConnections[sourceType].includes(targetType)
    );
  };

  const generateUniqueEdgeId = () => {
    setEdgeCounter((prevCounter) => prevCounter + 1);
    return `edge-${edgeCounter}-${uuidv4()}`;
  };

  const formData = useSelector(selectGetAllFormData);

  const onSave = async (e) => {
    e.preventDefault();

    let isJourneyNameExist = "";

    if (reactFlowInstance) {
      const rowData = reactFlowInstance?.toObject();
      localStorage?.setItem(flowKey, JSON?.stringify(rowData));
    }
    let url = `${baseURL}/cl/apis/v1/campaignJourney/`;
    if (journeyId?.trim()?.length) {
      url += journeyId;
    }
    if (!journeyName?.trim()?.length) {
      enqueueSnackbar("Provide Journey Name", {
        variant: "error",
        anchorOrigin: { horizontal: "right", vertical: "top" },
      });
      return;
    }

    // debugger

    if (state == null) {
      try {
        // Send a POST request to check if the journey name exists
        const res = await axiosInstance.post(
          apiEndPoints.JourneyNameExistOrNot,
          {
            journeyName: journeyName,
          }
        );
        if (res.data.status === "true") {
          enqueueSnackbar(`${res.data.msg}`, { variant: "success" });
        }
        isJourneyNameExist = res?.data?.status;
      } catch (error) {
        // Handle errors (display more specific information if needed)
        enqueueSnackbar(error?.response?.data?.msg, {
          variant: "error",
        });
      }
    }

    const serializedObject = localStorage?.getItem("userInfo");

    if (serializedObject !== null) {
      const myObject = JSON.parse(serializedObject);

      var createdByName = myObject.name;
      var createdBy = myObject.id;
      var updatedByName = myObject.id;
      var updatedBy = myObject.id;
    } else {
      console.log("Object not found in local storage");
    }
    // default node name of email
    const updatednodes = nodes.map((node) => {
      if (
        node?.type === "send_email" &&
        (!node?.data?.nodeName || node?.data?.nodeName?.trim() === "")
      ) {
        return {
          ...node,
          data: {
            ...node.data,
            nodeName: node?.data?.title,
          },
        };
      }
      return node;
    });
    const flowdata = {
      journeyName,
      active: "active",
      rowData: {
        nodes: updatednodes,
        edges,
        formData,
      },
      createdByName,
      createdBy,
      updatedByName,
      updatedBy,
      schedule,
      description: "false",
    };

    // debugger;
    const isValid = checkJourneyValidOrNot({
      nodes,
      edges,
      formData,
    });
    console.log('isValid', isValid)
    if (isValid.action === 1) {
      try {
        const response = journeyId?.trim()?.length
          ? await axiosInstance.put(url, flowdata)
          : await axiosInstance.post(url, flowdata);
        console.log(response, "response");
        enqueueSnackbar(`${response.data.message}`, { variant: "success" });
        navigate("/");
      } catch (error) {
        enqueueSnackbar(error?.response?.data?.message, { variant: "error" });
      }
    } else {
      if (isJourneyNameExist == "false") {
        if (Object.keys(isValid).length === 0) {
          enqueueSnackbar("Please create the Journey", { variant: "error" });
        } else {
          enqueueSnackbar(`${isValid.message}`, { variant: "error" });
        }
      }
    }
  };

  const onConnect = useCallback(
    (params) => {
      // debugger;

      const sourceInfo = params.source.replace(/^dndnode_\d+_/, "");
      const targetInfo = params.target.replace(/^dndnode_\d+_/, "");

      if (sourceInfo && targetInfo) {
        if (validateConnection(sourceInfo, targetInfo)) {
          const newEdgeId = generateUniqueEdgeId();
          // debugger;
          if (params.sourceHandle) {
            // Extract the label from sourceHandle
            // const edgeName = `${params.sourceHandle}-${uuidv4()}`;
            const edgeName = `${params.sourceHandle}-${uuidv4()}`;
            const edgeNameLable = params.sourceHandle.split("-")[1];
            const existingEdge = edges.find(
              (edge) =>
                edge.source === params.source && edge.target === params.target
            );

            if (existingEdge) {
              // If the edge already exists, update its label
              const updatedEdges = edges.map((edge) =>
                edge.id === existingEdge.id
                  ? { ...edge, label: edgeNameLable, handle: edgeNameLable ,
                    type: 'custom', // Use the custom edge type
                    data: { onDelete: handleDeleteEdge,text:edgeNameLable  },
                          }
                  : edge
              );

              console.log("updatedEdges",updatedEdges)
              setEdges(updatedEdges);
            } else {
              // If the edge doesn't exist, create a new edge
              const newEdge = {
                id: edgeName,
                source: params.source,
                target: params.target,
                handle: edgeNameLable,
                label: edgeNameLable,
                type:'custom',
                data: { onDelete: handleDeleteEdge, text:edgeNameLable },
              };
              setEdges([...edges, newEdge]);
              console.log("newEdge",newEdge)
            }
          } else {
            // Extract the label from sourceHandle
            const edgeName2 = params.sourceHandle;

            const existingEdge2 = edges.find(
              (edge) =>
                edge.source === params.source &&
                edge.target === params.target &&
                edge.label === edgeName2
            );

            if (existingEdge2) {
              // If the edge already exists, update its label
              const updatedEdges = edges.map((edge) =>
                edge.id === existingEdge2.id
                  ? { ...edge, label: edgeName2 ,type:'custom',
                  data: { onDelete: handleDeleteEdge , text:edgeName2 }}
                  : edge
              );
              setEdges(updatedEdges);
            } else {
              // If the edge doesn't exist, create a new edge
                 const newEdge = {
                id: newEdgeId,
                source: params.source,
                target: params.target,
                handle: edgeName2,
                label: "",
                type:'custom',
                data: { onDelete: handleDeleteEdge, text:''},
              };
              console.log("newEdge",newEdge)
              setEdges([...edges, newEdge]);
            }
          }
        } else {
          // Handle validation error
          enqueueSnackbar("Invalid connection", {
            variant: "error",
            anchorOrigin: { horizontal: "right", vertical: "top" },
          });
          return;
        }
      } else {
        enqueueSnackbar("Invalid source or target node", {
          variant: "error",
          anchorOrigin: { horizontal: "right", vertical: "top" },
        });
      }
    },
    [edges]
  );

  const handleDeleteEdge = (id) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== id));
  };

  let id = nodes.length;
  // const getId = () => `dndnode_${id++}`;
  const usedIds = new Set(nodes.map((node) => node.id));

  const getId = () => {
    let newId;
    do {
      newId = `dndnode_${id++}`;
    } while (usedIds.has(newId));
    usedIds.add(newId);
    return newId;
  };

  const onDrop = useCallback(
    (event) => {
      //   debugger;
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }
      if (type === "end_journey" && initialEndNode) {
        enqueueSnackbar("Only one end node is mandatory.", {
          variant: "error",
          anchorOrigin: { horizontal: "right", vertical: "top" },
        });
        return;
      }
      if (type === "begin_journey" && initialBeginNode) {
        enqueueSnackbar("Only one begin node is mandatory.", {
          variant: "error",
          anchorOrigin: { horizontal: "right", vertical: "top" },
        });
        return;
      }
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { title, description } = useNodeInfo(type);
      const newNode = {
        id: `${getId()}_${type}`,
        type,
        position,
        data: {
          title, // Set the title dynamically
          description, // Set the description dynamically

          stats: {
            started: 0,
          },
          ...(type === "send_email" && {
            nodeName: title,
          }),
        },
      };
      if (type === "end_journey") {
        dispatch(setEndNode(true));
      }
      if (type === "begin_journey") {
        dispatch(setBeginNode(true));
      }
      console.log(newNode, "newNode");
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, initialEndNode, initialBeginNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // =================================>

  return (
    <>
      <Box className="journey_appbar_container">
        <Box className="journey_appbar">
          <Grid container>
            <Grid className="journey_appbar_backButton" item>
              <Button onClick={navigateToListFlow} sx={{ height: "100%" }}>
                <ArrowCircleLeftOutlinedIcon />
              </Button>
            </Grid>
            <Box variant="div" className="journey_appbar_journey">
              <Grid item sx={{ flexGrow: 1 }}>
                <Input
                  placeholder="Journey name"
                  className="custom-input" // Add a custom class name
                  disableUnderline // Disable the underline
                  variant="outlined"
                  value={journeyName}
                  onChange={(e) => {
                    dispatch(setJourneyName(e.target.value));
                  }}
                />
              </Grid>
              <Grid item>
                {/* <Button className="journey_appbar_draft" onClick={handleClick}>SCHEDULE</Button>{" "} */}
                {/* <Button className="journey_appbar_draft" onClick={onRun}>RUN</Button>{" "} */}
                &nbsp; &nbsp;
                <Button
                  className="journey_appbar_publish"
                  onClick={(e) => {
                    onSave(e);
                    console.log("object");
                  }}
                  type="Submit"
                  // disabled={isJourneyNameExists}
                >
                  SAVE/DRAFT
                </Button>
              </Grid>
            </Box>
          </Grid>
        </Box>
      </Box>
      <div className="AutomationCanvas">
        <ReactFlowProvider>
          <div ref={reactFlowWrapper} className="reactflow-wrapper">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodesConnectable={true}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              panOnScroll
              panOnDrag
              preventScrolling
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              deleteKeyCode={null}
            >
              <Controls showInteractive={false} className="Controls" />
              <MiniMap />
              <Background variant="dots" gap={16} size={1} />
            </ReactFlow>
          </div>
        </ReactFlowProvider>
      </div>
    </>
  );
};

const Layout = (props) => (
  <ReactFlowProvider>
    <Automation {...props} />
  </ReactFlowProvider>
);

export default Layout;
