import { CXIconProps } from '@/assets/icons/IconProps';
import colors from '../../colors';

const Paperclip = ({ color = colors.Gray[600], size = '16' }: CXIconProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
    >
        <path
            d="M14.1017 7.26647L8.09127 13.2769C6.72443 14.6437 4.50836 14.6437 3.14152 13.2769C1.77469 11.91 1.77469 9.69396 3.14152 8.32713L9.15193 2.31672C10.0632 1.4055 11.5405 1.40549 12.4518 2.31672C13.363 3.22794 13.363 4.70533 12.4518 5.61655L6.67705 11.3913C6.22144 11.8469 5.48275 11.8469 5.02714 11.3913C4.57153 10.9356 4.57153 10.197 5.02714 9.74134L10.0947 4.67374"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
export default Paperclip;
