import * as React from "react";
import { Box } from "@mui/system";
import QuickCampaignTable from "./Components/table";

const Index = () => {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          mt: 2,
          backgroundColor: "#fff",
        }}
      >
        <QuickCampaignTable />
      </Box>
    </>
  );
};
export default Index;
