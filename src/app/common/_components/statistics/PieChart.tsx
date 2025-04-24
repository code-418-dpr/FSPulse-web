// src/app/common/_components/statistics/PieChart.tsx
import React from "react";
import {
    PieChart as RePieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    TooltipProps,
    PieLabelRenderProps,
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

interface PayloadItem {
    name: string;
    value: number;
    payload: PieData & { fill?: string };
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
                                                                   active,
                                                                   payload,
                                                               }) => {
    if (active && payload && payload.length > 0) {
        const item = payload[0] as PayloadItem;
        return (
            <div className="chart-tooltip">
                <p className="font-medium">{item.name}</p>
                <p className="font-semibold" style={{ color: item.payload.fill }}>
                    {item.value}
                </p>
            </div>
        );
    }
    return null;
};

const renderCustomizedLabel = (props: PieLabelRenderProps) => {
    // ensure numeric values
    const cxNum = Number(props.cx);
    const cyNum = Number(props.cy);
    const midAngle = Number(props.midAngle);
    const innerRadius = Number(props.innerRadius);
    const outerRadius = Number(props.outerRadius);
    const percent = Number(props.percent);

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cxNum + radius * Math.cos(-midAngle * RADIAN);
    const y = cyNum + radius * Math.sin(-midAngle * RADIAN);

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

const COLORS = ["#2889f4", "#944dee", "#39cc7d", "#f7b342", "#f43377"];

export const PieChart: React.FC<PieChartProps> = ({ data }) => (
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
                            key={index}
                            fill={entry.color ?? COLORS[index % COLORS.length]}
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
                    formatter={(value: string | number) => (
                        <span className="text-sm text-foreground/80">{value}</span>
                    )}
                />
            </RePieChart>
        </ResponsiveContainer>
    </ChartContainer>
);
