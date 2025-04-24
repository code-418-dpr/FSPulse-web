// src/app/common/_components/statistics/LineChart.tsx
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import React from "react";

import { ChartContainer } from "./ChartContainer";

interface DataPoint {
    label: string;
    value: number;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: { value: number }[];
    label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
        return (
            <div className="chart-tooltip">
                <p className="font-medium">{label}</p>
                <p className="text-primary-500 font-semibold">{payload[0].value}</p>
            </div>
        );
    }
    return null;
};

interface LineChartProps {
    data: DataPoint[];
    strokeColor?: string;
    areaColor?: string;
    showArea?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({
    data,
    strokeColor = "#2889f4",
    areaColor = "rgba(40, 137, 244, 0.1)",
    showArea = true,
}) => (
    <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={areaColor} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={areaColor} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#70828f", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#70828f", fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                {showArea && (
                    <Area type="monotone" dataKey="value" stroke="none" fillOpacity={1} fill="url(#colorValue)" />
                )}
                <Line
                    type="monotone"
                    dataKey="value"
                    stroke={strokeColor}
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                    activeDot={{ r: 6, strokeWidth: 0, fill: strokeColor }}
                />
            </ComposedChart>
        </ResponsiveContainer>
    </ChartContainer>
);
