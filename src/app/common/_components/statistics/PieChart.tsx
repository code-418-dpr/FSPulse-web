import React from "react";
import {
    PieChart as RePieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
import { ChartContainer } from "./ChartContainer";

interface PieData {
    label: string;
    value: number;
    color?: string;
}

interface PieChartProps {
    data: PieData[];
}

const COLORS = ["#2889f4", "#944dee", "#39cc7d", "#f7b342", "#f43377"];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        return (
            <div className="chart-tooltip">
                <p className="font-medium">{data.name}</p>
                <p className="font-semibold" style={{ color: data.payload.fill }}>
                    {data.value}
                </p>
            </div>
        );
    }
    return null;
};

const renderCustomizedLabel = ({
                                   cx,
                                   cy,
                                   midAngle,
                                   innerRadius,
                                   outerRadius,
                                   percent,
                               }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="#fff"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={12}
            fontWeight={600}
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export const PieChart: React.FC<PieChartProps> = ({ data }) => {
    return (
        <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={40}
                        labelLine={false}
                        label={renderCustomizedLabel}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`slice-${index}`}
                                fill={entry.color || COLORS[index % COLORS.length]}
                                stroke="none"
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) => (
                            <span className="text-sm text-foreground/80">{value}</span>
                        )}
                    />
                </RePieChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
};