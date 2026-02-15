import { CXIconProps } from '@/assets/icons/IconProps';
import colors from '@/stadiumDS/foundations/colors';

const EyeOff = ({ color = colors.Gray[600], size = '16' }: CXIconProps) => (
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
            d="M10.743 4.092Q11.353 4.001 12 4c5.105 0 8.455 4.505 9.58 6.287.137.215.205.323.243.49.029.125.029.322 0 .447-.038.166-.107.274-.244.492-.3.474-.757 1.141-1.363 1.865M6.724 5.715c-2.162 1.467-3.63 3.504-4.303 4.57-.137.217-.205.325-.243.492a1.2 1.2 0 0 0 0 .446c.038.167.106.274.242.49C3.546 13.495 6.895 18 12 18c2.059 0 3.832-.732 5.289-1.723M3 2l18 18M9.88 8.879a3 3 0 1 0 4.243 4.243"
        />
    </svg>
);
export default EyeOff;
