import React, { useEffect, useState } from 'react';

const CircularLoader = () => {
  const [requiredFormData, setRequiredFormData] = useState({
    ipAddress: "27.58.198.105",
    maxAmount: 5000,
    color: "#3f51b5",
    uid: "",
    s1: "",
    s2: "",
    domain: "theloansolution.org",
    webmasterSourceID: "LOANSOL",
    email_address: "",
    applied_amount: "0",
  });

  useEffect(() => {
    // Load data or perform any other initialization here if needed
  }, []);

  return (
    <div id="zappian_form">
      <style>
        {`.Home {
          display: grid;
          justify-content: center;
          align-items: center;
          margin: 2rem auto;
          flex-direction: column;
          padding: 2rem 0rem;
          max-width: 540px;
          min-width: 300px;
        //   box-shadow: 0 0 10px 0px #eeeeee;
          border-radius: 0.44rem;
        }

        .ripple {
          display: block;
          position: relative;
          width: 300px;
          height: 300px;
        }

        .ripple div.first {
          position: absolute;
          border: 8px solid ${requiredFormData.color};
          opacity: 1;
          border-radius: 50%;
          animation: ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
          margin: auto;
        }

        .ripple div.second {
          position: absolute;
          border: 8px solid ${requiredFormData.color};
          opacity: 1;
          border-radius: 50%;
          animation: ripple 1.5s cubic-bezier(0, 0.2, 0.8, 1) infinite;
          margin: auto;
          font-weight: 700;
          color: ${requiredFormData.color};
        }

        .ripple div.third {
          position: absolute;
          border: 8px solid ${requiredFormData.color};
          opacity: 1;
          border-radius: 50%;
          animation: ripple 2s cubic-bezier(0, 0.2, 0.8, 1) infinite;
          margin: auto;
        }

        .ripple div:nth-child(2) {
          animation-delay: 0s;
        }

        @keyframes ripple {
          0% {
            top: 48%;
            left: 50%;
            width: 0;
            height: 0;
            opacity: 1;
          }

          100% {
            top: 50px;
            left: 50px;
            width: 200px;
            height: 200px;
            opacity: 0;
          }
        }`}
      </style>
      <div className="Home">
        <div className="ripple">
          <div className="first"></div>
          {/* <div className="second">Loading...</div> */}
          <div className="third"></div>
        </div>
      </div>
    </div>
  );
};

export default CircularLoader;
