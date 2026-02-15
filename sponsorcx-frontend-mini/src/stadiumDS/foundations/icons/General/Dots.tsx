import { CXIconProps } from '@/assets/icons/IconProps';
import colors from '../../colors';

const dMap = {
    grid: 'M12 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2M12 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2M12 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2M19 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2M19 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2M19 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2M5 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2M5 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2M5 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2',
    horizontal:
        'M12 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2M19 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2M5 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2',
    vertical:
        'M12 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2M12 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2M12 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2',
};

interface DotsProps extends CXIconProps {
    variant: keyof typeof dMap;
}

const Dots = ({
    color = colors.Gray[600],
    size = '16',
    variant,
}: DotsProps) => (
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
export default Dots;
