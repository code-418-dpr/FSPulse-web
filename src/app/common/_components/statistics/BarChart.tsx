// src/app/common/_components/statistics/BarChart.tsx
import { BarChart as ReBar, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer } from './ChartContainer';

interface DataPoint { label: string; value: number; }
interface BarChartProps {
    data: DataPoint[];
    color?: string;  // можно задать позже через стили
}

export const BarChart: React.FC<BarChartProps> = ({ data }) => (
    <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
            <ReBar data={data}>
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" />
            </ReBar>
        </ResponsiveContainer>
    </ChartContainer>
);
