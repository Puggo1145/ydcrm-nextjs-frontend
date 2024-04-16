"use client"

import Loader from "../components/loader";
import { cn } from "@/lib/utils";

import { useState } from "react";

interface Props {
    loadByDefault?: boolean;
}

interface SpinnerProps {
    size: "default" | "sm" | "lg" | "icon";
    className?: string;
}

const useSpinner = ({ loadByDefault }: Props = {}) => {
    const [loading, setLoading] = useState(loadByDefault);

    const Spinner = ({className, size}: SpinnerProps) => (
        loading ? <Loader className={cn("text-foreground", className)} size={size} /> : null
    );

    return ({
        loading,
        setLoading,
        Spinner
    })
};

export default useSpinner;