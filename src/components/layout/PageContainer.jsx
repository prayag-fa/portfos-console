"use client";

import React from "react";

export default function PageContainer({ children, className = "" }) {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
} 