import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AceEditor from "react-ace";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";

import { Grid, List, ListItem, ListItemText, Paper } from "@mui/material";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  height: "100%",
  overflow: "auto",
};

export default function PreviewForm({ values, isTable, setPreviewTitle }) {
  // debugger
  const [open, setOpen] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  const handleOpen = () => {
    setOpen(true);
    setPreviewTitle("");
  };
  // const handleClose = () => setOpen(false);
  const handleClose = () => {
    setOpen(false);
    setPreviewTitle("preview");
  };
  // console.log(values);
  const createMarkup = (htmlString) => {
    return { __html: htmlString };
  };
  return (
    <div>
      {isTable ? (
        <VisibilityIcon sx={{ display: "block" }} onClick={handleOpen} />
      ) : (
        <Button onClick={handleOpen} variant="contained">
          Preview
        </Button>
      )}

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <>
              <Box sx={{ display: "flex", gap: "20px" }}>
                <Box sx={{ width: "50%" }}>
                  <Box>
                    {/* <Paper elevation={3} sx={{ p: "0px" }}> */}
                    <Box>
                      <Typography>
                        Campaign Name
                        <Typography sx={{ color: "darkblue" }}>
                          {" "}
                          {values?.campaignName}
                        </Typography>
                      </Typography>
                    </Box>
                    {/* </Paper> */}
                    {/* /////////// */}
                    {/* <Paper elevation={3} sx={{ p: "20px", mt: 2 }}> */}
                    <Box>
                      <Grid>
                        <Grid item>
                          <Typography>Offer Link</Typography>
                          <Typography sx={{ color: "darkblue" }}>
                            {values?.offerId?.offer_link}
                          </Typography>
                        </Grid>
                        <br />
                        <Grid item>
                          <Typography>Personal Unsub Link :</Typography>
                          <Typography sx={{ color: "darkblue" }}>
                            {values?.offerId?.personal_unsub}
                          </Typography>
                        </Grid>
                        <br />
                        <Grid item>
                          <Typography>Network Unsub Link :</Typography>
                          <Typography sx={{ color: "darkblue" }}>
                            {values?.offerId?.network_unsub}
                          </Typography>
                        </Grid>
                        <br />
                        <Grid item sx={{ display: "flex" }}>
                          <Typography>S1 :</Typography>
                          <Typography sx={{ color: "orangered" }}>
                            {" "}
                            &nbsp; {values?.s1}
                          </Typography>
                        </Grid>
                        <Grid item sx={{ display: "flex" }}>
                          <Typography>S2 :</Typography>
                          <Typography sx={{ color: "orangered" }}>
                            {" "}
                            &nbsp; {values?.s2}
                          </Typography>
                        </Grid>
                        <Grid item sx={{ display: "flex" }}>
                          <Typography>S3 :</Typography>
                          <Typography sx={{ color: "orangered" }}>
                            {" "}
                            &nbsp; {values?.s3}
                          </Typography>
                        </Grid>
                        <br />
                      </Grid>
                    </Box>
                    {/* </Paper> */}
                    {/* //////////   */}
                  </Box>
                  <Box sx={{ display: "flex", mt: 2 }}>
                    {/* <Paper elevation={3} sx={{ p: "20px" }}> */}
                    <Grid>
                      <Typography>From Name</Typography>
                      <Typography sx={{ color: "darkblue" }}>
                        {values?.fromName}
                      </Typography>
                    </Grid>
                    {/* </Paper> */}
                    {/* <Paper elevation={3} sx={{ p: "20px", ml: 2 }}> */}
                    <Grid sx={{ ml: 4 }}>
                      <Typography>Subject Name</Typography>
                      <Typography sx={{ color: "darkblue" }}>
                        {" "}
                        {values?.subjectLine}
                      </Typography>
                    </Grid>
                    {/* </Paper>   */}
                  </Box>

                  {/* ////// */}
                  <Box sx={{ display: "flex", mt: 2 }}>
                    {/* <Paper elevation={3} sx={{ p: "20px" }}> */}
                    <Grid>
                      <Typography>From Domain</Typography>
                      <Typography sx={{ color: "darkblue" }}>
                        {values?.fromDomain}
                      </Typography>
                    </Grid>
                    {/* </Paper> */}
                    {/* <Paper elevation={3} sx={{ p: "20px", ml: 2 }}> */}
                    <Grid sx={{ ml: 4 }}>
                      <Typography>Reply To</Typography>
                      <Typography sx={{ color: "orangered" }}>
                        {" "}
                        {values?.fromEmailName}
                      </Typography>
                    </Grid>
                    {/* </Paper> */}
                  </Box>
                  {/* ///// */}
                  <Box sx={{ display: "flex", mt: 2 }}>
                    {/* <Paper elevation={3} sx={{ p: "20px" }}> */}
                    <Grid>
                      <Typography>Email Service Type</Typography>
                      <Typography sx={{ color: "darkblue" }}>
                        {" "}
                        {values?.emailServiceType}
                      </Typography>
                    </Grid>
                    {/* </Paper> */}
                    {values?.emailServiceType === "esp" && (
                      <>
                        {/* <Paper elevation={3} sx={{ p: "20px", ml: 2 }}> */}
                        <Grid sx={{ ml: 4 }}>
                          <Typography>ESP Name</Typography>
                          <Typography sx={{ color: "darkblue" }}>
                            {" "}
                            {values?.espName?.esp_name}
                          </Typography>
                        </Grid>
                        {/* </Paper> */}
                        {/* <Paper elevation={3} sx={{ p: "20px", ml: 2 }}> */}
                        <Grid sx={{ ml: 4 }}>
                          <Typography>Email Service Account</Typography>
                          <Typography sx={{ color: "darkblue" }}>
                            {" "}
                            {values?.emailServiceAccount?.account_name}
                          </Typography>
                        </Grid>
                        {/* </Paper> */}
                      </>
                    )}
                  </Box>
                  {/* /////// */}
                  <Box sx={{ display: "flex", mt: 2 }}>
                    {/* <Paper elevation={3} sx={{ p: "20px" }}> */}
                    <Grid>
                      <Typography>Included List Segments</Typography>
                      <Typography sx={{ color: "darkblue" }}>
                        {values?.segmentData?.map((segment) =>
                          segment?.data?.map(
                            (item, itemIndex) =>
                              item.type === "includeSegnment" && (
                                <div key={itemIndex}>
                                  <Typography>
                                    {`${item?.segment_name} (${item?.count})`}
                                  </Typography>
                                </div>
                              )
                          )
                        )}
                      </Typography>
                    </Grid>
                    {/* </Paper> */}
                    {/* <Paper elevation={3} sx={{ p: "20px", ml: 2 }}> */}
                    <Grid sx={{ ml: 4 }}>
                      <Typography>Excluded List Segments</Typography>
                      <Typography sx={{ color: "darkblue" }}>
                        {values?.segmentData?.map((segment) =>
                          segment?.data?.map(
                            (item, itemIndex) =>
                              item?.type === "excludeSegnment" && (
                                <div key={itemIndex}>
                                  <Typography>
                                    {`${item?.segment_name} (${item?.count})`}
                                  </Typography>
                                </div>
                              )
                          )
                        )}{" "}
                      </Typography>
                    </Grid>
                    {/* </Paper> */}
                    {/* <Paper elevation={3} sx={{ p: "20px", ml: 2 }}> */}
                    <Grid sx={{ ml: 4 }}>
                      <Typography>Suppression Lists</Typography>
                      <List sx={{ color: "darkblue" }}>
                        {values?.suppressionListId?.map((list) => (
                          <ListItem sx={{ padding: 0 }} key={list.id}>
                            {list?.created_by_name} ({list?.list_type}) (
                            {list?.list_data_type})
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                    {/* </Paper> */}
                  </Box>
                  {/* ///// */}
                  <Box sx={{ display: "flex", mt: 2 }}>
                    {/* <Paper elevation={3} sx={{ p: "20px" }}> */}
                    <Grid sx={{ display: "flex" }}>
                      <Typography>Start From Count : </Typography>
                      <Typography sx={{ color: "orangered" }}>
                        {" "}
                        &nbsp;{values?.rangeFrom}
                      </Typography>
                    </Grid>
                    {/* </Paper> */}
                    {/* <Paper elevation={3} sx={{ p: "20px", ml: 2 }}> */}
                    <Grid sx={{ display: "flex", ml: 4 }}>
                      <Typography>End To Count : </Typography>
                      <Typography sx={{ color: "orangered" }}>
                        {" "}
                        &nbsp;{values?.rangeTo}
                      </Typography>
                    </Grid>
                    {/* </Paper> */}
                    {/* <Paper elevation={3} sx={{ p: "20px", ml: 2 }}> */}
                    <Grid sx={{ display: "flex", ml: 4 }}>
                      <Typography>Max Data Limit : </Typography>
                      <Typography sx={{ color: "orangered" }}>
                        {" "}
                        &nbsp; {values?.maxCount}
                      </Typography>
                    </Grid>
                    {/* </Paper> */}
                  </Box>
                  {/* ///// */}
                  <Box sx={{ display: "flex", mt: 2 }}>
                    {values.scheduleType === "schedularLater" && (
                      <>
                        {/* <Paper elevation={3} sx={{ p: "20px" }}> */}
                        <Grid>
                          <Typography>Schedule Date </Typography>
                          <Typography sx={{ color: "orangered" }}>
                            {values?.scheduleDate === ""
                              ? null
                              : typeof values?.scheduleDate === "string"
                              ? new Date(
                                  values?.scheduleDate
                                ).toLocaleDateString()
                              : values?.scheduleDate instanceof Date &&
                                values?.scheduleDate.toLocaleDateString()}

                            {/* {values?.scheduleDate === "" ?? null}
                            {typeof values?.scheduleDate === "string" ? new Date(values?.scheduleDate).toLocaleDateString() : null} */}
                          </Typography>
                        </Grid>
                        {/* </Paper> */}
                        {/* <Paper elevation={3} sx={{ p: "20px", ml: 2 }}> */}
                        <Grid sx={{ ml: 4}}>
                          <Typography>Schedule Time </Typography>
                          <Typography sx={{ color: "orangered" }}>
                            {values?.scheduleStartTime &&
                              new Date(
                                `01/01/2000 ${values?.scheduleStartTime}`
                              ).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              })}
                          </Typography>
                        </Grid>
                        {/* </Paper> */}
                      </>
                    )}

                    {/* <Paper elevation={3} sx={{ p: "20px", ml: 2 }}> */}
                    <Grid sx={{ ml: 4}}>
                      <Typography>Time Zone </Typography>
                      <Typography sx={{ color: "orangered" }}>
                        {values?.timezone?.label}
                      </Typography>
                    </Grid>
                    {/* </Paper> */}
                  </Box>
                </Box>
                <Box sx={{ height: "100%" }}>
                  {/* editor */}
                  {/* <Paper elevation={3}> */}
                  <div
                    style={{
                      width: "",
                      height: "90vh",
                      border: "",
                      overflow: "scroll",
                    }}
                    dangerouslySetInnerHTML={createMarkup(values?.htmlCode)}
                  />
                  {/* </Paper> */}
                </Box>
              </Box>
            </>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 0,
              }}
            >
              <Button
                variant="contained"
                sx={{ backgroundColor: "red" }}
                onClick={() => {
                  setOpen(false);
                }}
              >
                Close <CloseIcon />
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
