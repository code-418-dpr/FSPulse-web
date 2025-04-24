import React from "react";

interface ChartContainerProps {
    height?: number | string;
    width?: number | string;
    children: React.ReactNode;
    className?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
                                                                  height = 300,
                                                                  width = "100%",
                                                                  children,
                                                                  className = "",
                                                              }) => (
    <div
        style={{ width, height }}
        className={`flex items-center justify-center rounded-lg p-2 ${className}`}
    >
        {children}
    </div>
);