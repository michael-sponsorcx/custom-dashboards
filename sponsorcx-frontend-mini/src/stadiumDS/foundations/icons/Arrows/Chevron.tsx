import { CXIconProps } from '@/assets/icons/IconProps';
import colors from '../../colors';

const dMap = {
    down: 'm6 9 6 6 6-6',
    'down-double': 'm7 13 5 5 5-5M7 6l5 5 5-5',
    left: 'm15 18-6-6 6-6',
    'left-double': 'm18 17-5-5 5-5m-7 10-5-5 5-5',
    right: 'm9 18 6-6-6-6',
    'right-double': 'm6 17 5-5-5-5m7 10 5-5-5-5',
    'selector-horizontal': 'm9 7-5 5 5 5m6-10 5 5-5 5',
    'selector-vertical': 'm7 15 5 5 5-5M7 9l5-5 5 5',
    up: 'm18 15-6-6-6 6',
    'up-double': 'm17 18-5-5-5 5m10-7-5-5-5 5',
};

interface ChevronProps extends CXIconProps {
    variant: keyof typeof dMap;
}

const Chevron = ({
    color = colors.Gray[500],
    size = '16',
    variant,
}: ChevronProps) => (
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
export default Chevron;
