import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Icon from "@mdi/react";
import { mdiTune, mdiViewDashboard } from "@mdi/js";
import {
  mdiDatabaseEdit,
  mdiChartBox,
  mdiChartBoxPlusOutline,
  mdiCog,
  mdiSecurity,
  mdiImageMove,
  mdiImageAlbum,
  mdiIp,
} from "@mdi/js";
import { useNavigate } from "react-router";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const dataLabsNavigation = [
  {
    title: "Campaign Journey",
    icon: mdiViewDashboard,
    desc: "Campaign Journey : Displaying Campaign Journey List in one place",
    route: "/",
  },
  {
    title: "Campaign Stats",
    icon: mdiChartBoxPlusOutline,
    route: "/campaign-stats",
  },
  {
    title: "Journey Performance Stats",
    icon: mdiChartBox,
    route: "/all-journey-stats",
  },
  {
    title: "Presets",
    icon: mdiTune,
    route: "/Presets/network",
  },
  {
    title: "Data Management",
    icon: mdiDatabaseEdit,
    route: "/data-management/list",
  },

  {
    title: "Admin Console",
    icon: mdiSecurity,
    route: "/admin-console/domain",
  },
  {
    title: "Global Journey Settings",
    icon: mdiCog,
    route: "/global-settings/esp",
  },
  {
    title: "Image Hosting",
    icon: mdiImageMove,
    route: "/image-hosting",
  },
   {
  title: "Domain / IP Historical data",
     icon: mdiIp,
     route: "/domain-details",
   },
  {
    title: "Creative",
    icon: mdiImageAlbum,
    route: "/creative/network-list",
  },
];

export default function HeaderNmainav() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleOpenDataMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseDataMenu = () => {
    setAnchorEl(null);
  };

  const pageName =
    window.location.pathname === "/leads"
      ? "Leads"
      : window.location.pathname === "/dashboard"
        ? "Dashboard"
        : null;

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleOpenDataMenu}
        sx={{ color: "#fff" }}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {pageName}
      </Button>
      <Menu
        sx={{ marginTop: "20px", marginLeft: "-45px" }}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseDataMenu}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {dataLabsNavigation.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              navigate(item?.route);
              handleCloseDataMenu();
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* <CardMedia sx={{ mr: 2 }} component="img" height="30" image={item?.icon} alt={item?.title} /> */}
              <Box>
                <Icon path={item?.icon} size={1} />
              </Box>
              <Box p={1}>
                <Typography textAlign="left" variant="h4">
                  {item.title}
                </Typography>
                <Typography textAlign="left" variant="p">
                  {item.desc}
                </Typography>
              </Box>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
