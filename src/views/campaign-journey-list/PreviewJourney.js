import { Box, Button, Modal, Typography } from "@mui/material";
import "./Cards.css";
import { useDispatch } from "react-redux";
import { setFormData } from "store/action/journeyCanvas";
import { nodeTypes } from "views/react-email-flow/Nodes";
import { edgeTypes } from "views/react-email-flow/Edges";
import CloseIcon from "@mui/icons-material/Close";

import ReactFlow, {
  Controls,
  MiniMap,
  ReactFlowProvider,
  Background,
} from "reactflow";
const PreviewJourney = ({
  openPreview,
  initNodes,
  initEdges,
  setOpenPreview,
  journeyDetails,
}) => {
  const dispatch = useDispatch();
  const handleClosePreview = () => {
    setOpenPreview(false);
    dispatch(setFormData(null));
  };
  return (
    <Box>
      <Modal
        open={openPreview}
        // onClose={handleClosePreview}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            height: "80vh",
            width: "70vw",
            border: "20px solid grren",
          }}
        >
          <Button
            variant="contained"
            onClick={handleClosePreview}
            sx={{
              position: "fixed",
              top: 20,
              right: 25,
              backgroundColor: "red",
              "&:hover": {
                backgroundColor: "red",
              },
            }}
          >
            <CloseIcon />
          </Button>
          <div>
            <Typography textAlign={"center"} variant="h1">
              {journeyDetails.name}
            </Typography>
            <ReactFlowProvider>
              <div style={{ height: "70vh", width: "65vw" }}>
                <ReactFlow
                  nodes={initNodes}
                  edges={initEdges}
                  nodeTypes={nodeTypes}
                  edgeTypes={edgeTypes}
                  panOnScroll
                  preventScrolling
                  deleteKeyCode={null}
                  nodesDraggable={false}
                  nodesConnectable={false}
                >
                  <Controls showInteractive={false} />
                  <MiniMap />
                  <Background variant="dots" gap={16} size={1} />
                </ReactFlow>
              </div>
            </ReactFlowProvider>
          </div>
        </Box>
      </Modal>
    </Box>
  );
};

export default PreviewJourney;
