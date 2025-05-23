// src/app/common/_components/statistics/BarChart.tsx
import { Bar, CartesianGrid, BarChart as ReBar, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import React from "react";

import { ChartContainer } from "./ChartContainer";

interface DataPoint {
    label: string;
    value: number;
}

interface BarChartProps {
    data: DataPoint[];
    color?: string;
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

export const BarChart: React.FC<BarChartProps> = ({ data, color = "#2889f4" }) => (
    <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
            <ReBar data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#70828f", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#70828f", fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} background={{ fill: "#f7f9fc" }} />
            </ReBar>
        </ResponsiveContainer>
    </ChartContainer>
);
