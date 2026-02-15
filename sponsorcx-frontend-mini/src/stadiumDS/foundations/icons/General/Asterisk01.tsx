import { CXIconProps } from '@/assets/icons/IconProps';

const Asterisk01 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M12 1v20m7.071-17.071L4.93 18.07M22 11H2m17.071 7.071L4.93 3.93"
        />
    </svg>
);
export default Asterisk01;
