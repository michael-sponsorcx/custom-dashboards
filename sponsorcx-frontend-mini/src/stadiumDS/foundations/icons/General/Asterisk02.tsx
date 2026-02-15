import { CXIconProps } from '@/assets/icons/IconProps';

const Asterisk02 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M12 3v16m6-14L6 17m14-6H4m14 6L6 5"
        />
    </svg>
);
export default Asterisk02;
