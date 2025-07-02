// Icons.tsx
import React from 'react';

const Icon = ({ path, className = "w-6 h-6" }: { path: string, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d={path} />
  </svg>
);

export const ICONS = {
    search: <Icon path="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />,
    wrench: <Icon path="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />,
    price: <Icon path="M11.5 15h1v2h-1v-2zm0-6h1v5h-1V9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />,
    specs: <Icon path="M9 21H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2h-2m-6-16v16" />,
    desc: <Icon path="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />,
    link: <Icon path="M17 7h-4v2h4c1.1 0 2 .9 2 2s-.9 2-2 2h-4v2h4c2.21 0 4-1.79 4-4s-1.79-4-4-4zM7 9h4V7H7c-2.21 0-4 1.79-4 4s1.79 4 4 4h4v-2H7c-1.1 0-2-.9-2-2s.9-2 2-2z" />
};