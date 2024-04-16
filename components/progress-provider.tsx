"use client";

import { ReactNode } from "react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
const NprogressProvider = ({ children }: { children: ReactNode }) => {
    return (
        <>
            {children}
            <ProgressBar
                height="4px"
                color="#2563eb"
                options={{ showSpinner: true }}
            />
        </>
    );
};
export default NprogressProvider;
