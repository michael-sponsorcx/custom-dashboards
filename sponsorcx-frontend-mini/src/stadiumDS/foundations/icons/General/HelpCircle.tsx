import { CXIconProps } from '@/assets/icons/IconProps';

const HelpCircle = ({ color, size = '16' }: CXIconProps) => (
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
            d="M9.09 8a3 3 0 0 1 5.83 1c0 2-3 3-3 3m.08 4h.01M22 11c0 5.523-4.477 10-10 10S2 16.523 2 11 6.477 1 12 1s10 4.477 10 10"
        />
    </svg>
);
export default HelpCircle;
