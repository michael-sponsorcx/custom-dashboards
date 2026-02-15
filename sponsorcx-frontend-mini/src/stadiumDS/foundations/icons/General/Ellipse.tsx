import { CXIconProps } from '@/assets/icons/IconProps';
import colors from '../../colors';

const Ellipse = ({ color = colors.Gray[300], size = '3' }: CXIconProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 3 3"
        fill="none"
    >
        <circle cx="1.5" cy="2" r="1.5" fill={color} />
    </svg>
);

export default Ellipse;
