import { CXIconProps } from '@/assets/icons/IconProps';

const dMap = {
    '1': 'm4.93 3.93 14.14 14.14M22 11c0 5.523-4.477 10-10 10S2 16.523 2 11 6.477 1 12 1s10 4.477 10 10',
    '2': 'm4.93 3.93 14.14 14.14m0-14.14L4.93 18.07M22 11c0 5.523-4.477 10-10 10S2 16.523 2 11 6.477 1 12 1s10 4.477 10 10',
};

interface SlashCircleProps extends CXIconProps {
    variant?: keyof typeof dMap;
}

const SlashCircle = ({
    color,
    size = '24',
    variant = '1',
}: SlashCircleProps) => (
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
export default SlashCircle;
