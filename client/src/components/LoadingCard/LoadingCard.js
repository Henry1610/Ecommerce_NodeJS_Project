import React from "react";

const spinnerStyle = {
  width: 48,
  height: 48,
  border: "6px solid #e0e7ef",
  borderTop: "6px solid #3b82f6",
  borderRadius: "50%",
  animation: "spin 1s linear infinite"
};

const wrapperStyle = {
  width: "100%",
  minHeight: 200,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const LoadingCard = () => (
  <div style={wrapperStyle}>
    <div style={spinnerStyle} />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default LoadingCard;
