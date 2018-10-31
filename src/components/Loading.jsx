import React from "react";
import ReactLoading from "react-loading";
import "../styles/loading.css";

const Loading = ({ type, color }) => (
  <ReactLoading
    type="cylon"
    color="#ff3f34"
    height={150}
    width={150}
    className="loading-cylon"
  />
);

export default Loading;
