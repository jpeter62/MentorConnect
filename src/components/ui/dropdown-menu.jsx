import React from 'react';

export const DropdownMenu = ({ children }) => (
  <div className="dropdown-menu">{children}</div>
);

export const DropdownMenuTrigger = ({ onClick, children }) => (
  <button onClick={onClick} className="dropdown-menu-trigger">
    {children}
  </button>
);

export const DropdownMenuContent = ({ children }) => (
  <div className="dropdown-menu-content">{children}</div>
);

export const DropdownMenuItem = ({ onClick, children }) => (
  <div onClick={onClick} className="dropdown-menu-item">
    {children}
  </div>
);
