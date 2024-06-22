import React from "react";
import {
  Box,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { styled } from "@mui/system";
import { useEffect, useState } from "react";
import { getData } from "services/adminConsole/esp/domain/index";
import CircularLoader from "ui-component/CircularLoader";
import moment from "moment";
import DateFormatter from "utils/FormatDateTime";

const CustomTableRow = styled(TableRow)(({ index }) => ({
  backgroundColor: index % 2 === 0 ? "#F7F8FC" : "white",
}));
const headerCellStyle = {
  borderBottom: "2px solid #7C86BD",
  textAlign: "left",
  position: "relative",
};
const dividerStyle = {
  content: '""',
  position: "absolute",
  top: "10px",
  bottom: "0",
  left: "100%",
  borderLeft: "2px solid #DADADA",
  height: "40px",
};

const DomainTable = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [domainDetails, setDomainDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getTableData();
  }, []);

  const getTableData = async () => {
    try {
      setIsLoading(true);
      const data = await getData();
      setData(data?.result);
      setDomainDetails(data?.result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const itemsPerPage = 10;

  const handleSearch = (searchTerm) => {
    const filteredData = domainDetails?.filter((item) =>
      item?.domain_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log(filteredData, "data");
    setData(filteredData);
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = data?.slice(startIndex, endIndex);

  const CustomTableRow = styled(TableRow)(({ index }) => ({
    backgroundColor: index % 2 === 0 ? "#F7F8FC" : "white",
  }));

  return (
    <div>
      <Box
        sx={{
          backgroundColor: "#FEFEFE",
          borderRadius: "5px",
          boxShadow: "0px 0px 10px #EAEAEE",
          padding: "0.7rem 2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TextField
          type="text"
          placeholder="Search "
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyUp={(e) => handleSearch(e.target.value)}
          variant="outlined"
          size="small"
        />
      </Box>
      {isLoading ? (
        <>
          {" "}
          <Box
            sx={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularLoader />
          </Box>
        </>
      ) : (
        <Box sx={{ mt: 2 }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    align="left"
                    style={{ ...headerCellStyle, height: "50px" }}
                  >
                    Domain Id
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell align="left" style={{ ...headerCellStyle }}>
                    Account Name
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle }}>
                    Service Name
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle }}>
                    Account Email
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle }}>
                    Domain Name
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle }}>
                    Expiry Date
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle }}>
                    Price
                    <span style={dividerStyle}></span>
                  </TableCell>{" "}
                  <TableCell style={{ ...headerCellStyle }}>
                    Purchased Date
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle }}>
                    Renewal Date
                    {/* <span style={dividerStyle}></span> */}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {itemsToDisplay && itemsToDisplay?.length > 0 ? (
                  itemsToDisplay?.map((e, i) => (
                    <CustomTableRow index={i} key={i}>
                      <>
                        <TableCell>{e?.domain_id}</TableCell>
                        <TableCell>{e?.account_name}</TableCell>
                        <TableCell>{e?.service_name}</TableCell>
                        <TableCell>{e?.account_email}</TableCell>
                        <TableCell>{e?.domain_name}</TableCell>
                        <TableCell>{DateFormatter(e?.expiry_date)}</TableCell>
                        <TableCell>{e?.price}</TableCell>
                        <TableCell>
                          {DateFormatter(e?.purchased_date)}
                        </TableCell>
                        <TableCell>{DateFormatter(e?.renewal_date)}</TableCell>
                      </>
                    </CustomTableRow>
                  ))
                ) : (
                  <TableRow sx={{ height: "56.5vh" }}>
                    <TableCell
                      sx={{ border: "none" }}
                      colSpan={9}
                      align="center"
                    >
                      <span
                        style={{
                          padding: "10px",
                          border: "2px solid #444",
                          backgroundColor: "lightgoldenrodyellow",
                        }}
                      >
                        No data was found
                      </span>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack sx={{ pb: 2 }} spacing={2} mt={2}>
            <Stack spacing={2} mt={2}>
              <Pagination
                count={Math.ceil(data?.length / itemsPerPage)}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                variant="outlined"
                shape="rounded"
                color="primary"
              />
            </Stack>
          </Stack>
        </Box>
      )}
    </div>
  );
};

export default DomainTable;
