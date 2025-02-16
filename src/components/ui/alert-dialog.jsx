import React from 'react';

export const AlertDialog = ({ children }) => (
  <div className="alert-dialog">{children}</div>
);

export const AlertDialogContent = ({ children }) => (
  <div className="alert-dialog-content">{children}</div>
);

export const AlertDialogHeader = ({ children }) => (
  <div className="alert-dialog-header">{children}</div>
);

export const AlertDialogTitle = ({ children }) => (
  <h2 className="alert-dialog-title">{children}</h2>
);

export const AlertDialogDescription = ({ children }) => (
  <p className="alert-dialog-description">{children}</p>
);

export const AlertDialogFooter = ({ children }) => (
  <div className="alert-dialog-footer">{children}</div>
);

export const AlertDialogCancel = ({ onClick, children }) => (
  <button onClick={onClick} className="alert-dialog-cancel">
    {children}
  </button>
);

export const AlertDialogAction = ({ onClick, children }) => (
  <button onClick={onClick} className="alert-dialog-action">
    {children}
  </button>
);
