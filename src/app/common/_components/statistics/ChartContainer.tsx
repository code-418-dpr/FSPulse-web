// src/app/common/_components/statistics/ChartContainer.tsx
interface ChartContainerProps {
    height?: number;
    width?: number;
    children: React.ReactNode;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
                                                                  height = 300,
                                                                  width =  "100%",
                                                                  children
                                                              }) => (
    <div style={{ width, height }} className="flex items-center justify-center">
        {children}
    </div>
);
