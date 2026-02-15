import { CXIconProps } from '@/assets/icons/IconProps';
import colors from '@/stadiumDS/foundations/colors';

const FilterLines = ({
    color = colors.Gray[600],
    size = '16',
}: CXIconProps) => (
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
            d="M6 11h12M3 5h18M9 17h6"
        />
    </svg>
);
export default FilterLines;
