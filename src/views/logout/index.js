import { error } from "@contactlab/ds-tokens/constants/colors";
import axios from "axios";
import { gatewayURL } from "config/envConfig";
import React from "react";
import { useEffect } from "react";

const Logout = () => {
  const getRevokToken = () => {
    const data = {
      clientName: "campaignlabs",
    };

    const headers = {
      Authorization: JSON.parse(localStorage.getItem("token"))?.access_token
        ? "Bearer " + JSON.parse(localStorage.getItem("token"))?.access_token
        : null,
      "Content-Type": "application/json",
      accept: "application/json",
    };

    axios
      .post(`${gatewayURL}/secured/revoke-token`, { data }, { headers })
      .then((res) => {
        if (res?.data?.data === "Token revoked successfully") {
          localStorage.removeItem("token");
          delete axios.defaults.headers.common.Authorization;
        }
        window.location.href = "/";
      })
      .catch((error) => {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common.Authorization;
        window.location.href = "/";
      });
  };
  useEffect(() => {
    getRevokToken();
  }, []);

  return <div></div>;
};

export default Logout;
