import React from "react";

const CompanyBadge = ({ name, color = "#444", textColor = "#fff", logo }) => {
  const style = {
    background: color,
    color: textColor || (isDark(color) ? "#fff" : "#111"),
  };

  function isDark(hex) {
    try {
      const c = hex.replace("#", "");
      const r = parseInt(c.substr(0, 2), 16);
      const g = parseInt(c.substr(2, 2), 16);
      const b = parseInt(c.substr(4, 2), 16);
      // per ITU-R BT.601
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      return luminance < 150;
    } catch (e) {
      return true;
    }
  }

  return (
    <div className="badge" style={style} title={name}>
      <span className="badge-logo">{logo}</span>
      <span className="badge-name">{name}</span>
    </div>
  );
};

export default CompanyBadge;
