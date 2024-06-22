import React, { useState, useEffect } from "react";
import { styled } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axiosInstance from "helpers/apiService";
import { Box, display } from "@mui/system";
import { CircularProgress, Typography } from "@mui/material";
import { useParams } from "react-router";
import apiEndPoints from "helpers/APIEndPoints";


const CustomTableRow = styled(TableRow)(({ index }) => ({
  backgroundColor: index % 2 === 0 ? "#F7F8FC" : "white",
}));
const headerCellStyle = {
  width: '0%', 
  borderBottom: "2px solid #7C86BD",
  textAlign: "left",
  position: "relative",
};
const dividerStyle = {
   marginLeft: '5px',
  content: '""',
  position: "absolute",
  top: "10px",
  bottom: "0",
  left: "100%",
  borderLeft: "2px solid #DADADA",
  height: "40px",
};

const AllJourneyStats = () => {
  const [isLoading, setIsLoading] = useState(true); 
  const [data, setdata] = useState([]);
  const { id } = useParams();

  const getData = async () => {
    const data = {
      journeyId: id,
    };
    const myData = await axiosInstance.post(apiEndPoints.getJourneyStats, {
      data,
    });
    setdata(myData.data.data.data);
    setIsLoading(false);
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <Box>
      <Box sx={{ bgcolor: "#F7F8FC" }}>
        <Typography variant="h2" padding="20px">
          Single Journey Stats
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "90vh",
          padding: "5px 30px",
          border: "1px solid #DADADA",
          alignItems: "center",
          marginTop: "20px",
          bgcolor: "#fff",
        }}
      >
        {isLoading ? (
          <CircularProgress size={60} />
        ) : (
          <>
            {data.length === 0 ? (
              <Typography sx={{ mt: 5 }} variant="h1">
                No data available.
              </Typography>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        align="left"
                        style={{ ...headerCellStyle, height: "50px" }}
                      >
                        Node
                        <span style={dividerStyle}></span>
                      </TableCell>
                      <TableCell style={{ ...headerCellStyle }}>
                        {/* Count Bounce */}
                        Sent
                        <span style={dividerStyle}></span>
                      </TableCell>
                      <TableCell style={{ ...headerCellStyle }}>
                        {/* Count Clicked */}
                        <div style={{display:"flex" , justifyContent:"space-between"}}>
                          <span>Delivered</span>
                          <span>( % )</span>
                        </div>
                        <span style={dividerStyle}></span>
                      </TableCell>
                      <TableCell style={{ ...headerCellStyle }}>
                        {/* Count Opened */}
                        <div style={{display:"flex" , justifyContent:"space-between"}}>
                          <span>Bounce</span>
                          <span>( % )</span>
                        </div>
                        <span style={dividerStyle}></span>
                      </TableCell>
                      <TableCell style={{ ...headerCellStyle }}>
                        {/* Count Sent */}
                        <div style={{display:"flex" , justifyContent:"space-between"}}>
                          <span>Opens</span>
                          <span>( % )</span>
                        </div>
                        <span style={dividerStyle}></span>
                      </TableCell>
                      <TableCell style={{ ...headerCellStyle }}>
                        {/* Count Unsub */}
                        <div style={{display:"flex" , justifyContent:"space-between"}}>
                          <span>Clicks</span>
                          <span>( % )</span>
                        </div>
                        <span style={dividerStyle}></span>
                      </TableCell>
                      <TableCell style={{ ...headerCellStyle }}>
                        {/* Network Unsub */}
                        <div style={{display:"flex" , justifyContent:"space-between"}}>
                          <span>Personal Unsub</span>
                          <span>( % )</span>
                        </div>  
                        <span style={dividerStyle}></span>
                      </TableCell>
                      <TableCell style={{ ...headerCellStyle }}>
                      <div style={{display:"flex" , justifyContent:"space-between"}}>
                          <span>Network Unsub</span>
                          <span>( % )</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.length === 0 ? (
                      <Typography variant="h5">No data available.</Typography>
                    ) : (
                      data?.map((row, index) => (
                        <CustomTableRow key={row.name} index={index}>
                          <TableCell>{row.currentNode}</TableCell>
                          <TableCell>{row.countSent}</TableCell>
                          <TableCell>
                            <div style={{ display: "flex", justifyContent: "space-between", }} >
                              <span>{row.countSent}</span>
                              <span>{`${((row.countSent / row.countSent) * 100).toFixed(2)} %`}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div style={{ display: "flex", justifyContent: "space-between", }} >
                              <span>{row.countBounce}</span>
                              <span>{`${((row.countBounce / row.countSent) * 100).toFixed(2)} %`}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div style={{ display: "flex", justifyContent: "space-between", }} >
                              <span>{row.countOpened}</span>
                              <span>{`${((row.countOpened / row.countSent) * 100).toFixed(2)} %`}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div style={{ display: "flex", justifyContent: "space-between", }} >
                              <span>{row.countClicked}</span>
                              <span>{row.countOpened > 0 ? `${((row.countClicked / row.countOpened) * 100).toFixed(2)} %` : '0 %'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div style={{ display: "flex", justifyContent: "space-between", }} >
                              <span>{row.countUnsub}</span>
                              <span>{`${((row.countUnsub / row.countSent) * 100).toFixed(2)} %`}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div style={{ display: "flex", justifyContent: "space-between", }} >
                              <span>{row.countNetwork}</span>
                              <span>{`${((row.countNetwork / row.countSent) * 100).toFixed(2)} %`}</span>
                            </div>
                          </TableCell>
                        </CustomTableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default AllJourneyStats;
