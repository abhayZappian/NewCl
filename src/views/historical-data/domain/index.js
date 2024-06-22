import HistoricalDataHeader from "layout/MainLayout/Header/HistoricalDataHeader";
import React from "react";
import DomainTable from "./Components/table";

const index = () => {
  return (
    <div>
      <HistoricalDataHeader />
      <DomainTable />
    </div>
  );
};

export default index;
