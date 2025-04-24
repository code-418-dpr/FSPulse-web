// src/app/common/_components/statistics/LineChart.tsx
import {
    LineChart as ReLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { ChartContainer } from './ChartContainer';

interface DataPoint {
    label: string;
    value: number;
}

interface LineChartProps {
    data: DataPoint[];
    strokeColor?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
                                                        data,
                                                        strokeColor = '#8884d8'
                                                    }) => (
    <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
            <ReLineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke={strokeColor} activeDot={{ r: 6 }} />
            </ReLineChart>
        </ResponsiveContainer>
    </ChartContainer>
);
