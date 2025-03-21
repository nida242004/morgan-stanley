import React from "react";

const CheckBox = ({ label, name, checked, onChange }) => {
  return (
    <div className="checkbox-group">
      <input type="checkbox" name={name} checked={checked} onChange={onChange} />
      <label>{label}</label>
    </div>
  );
};

export default CheckBox;