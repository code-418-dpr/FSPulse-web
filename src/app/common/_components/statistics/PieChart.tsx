// src/app/common/_components/statistics/PieChart.tsx
import {
    PieChart as RePieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { ChartContainer } from './ChartContainer';

interface PieData {
    label: string;
    value: number;
    color?: string;
}

interface PieChartProps {
    data: PieData[];
}

export const PieChart: React.FC<PieChartProps> = ({ data }) => {
    const defaultColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042']; // основные цвета
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
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`slice-${index}`}
                                fill={entry.color || defaultColors[index % defaultColors.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                </RePieChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
};
