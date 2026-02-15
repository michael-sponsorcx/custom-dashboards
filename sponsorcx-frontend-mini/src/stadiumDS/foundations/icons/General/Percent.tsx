import { CXIconProps } from '@/assets/icons/IconProps';

const dMap = {
    '1': 'M19 4 5 18M7.5 5.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m11 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0',
    '2': 'M19 4 5 18M9 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0m10 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0',
    '3': 'M9 8h.01M15 14h.01M16 7l-8 8m1.5-7a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m6 6a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m6.5-3c0 5.523-4.477 10-10 10S2 16.523 2 11 6.477 1 12 1s10 4.477 10 10',
};

interface PercentProps extends CXIconProps {
    variant: keyof typeof dMap;
}

const Percent = ({ color, size = '16', variant }: PercentProps) => (
    <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill="none"
    >
        <path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d={dMap[variant]}
        />
    </svg>
);
export default Percent;
