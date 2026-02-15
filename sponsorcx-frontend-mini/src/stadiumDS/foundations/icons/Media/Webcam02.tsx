import { CXIconProps } from '@/assets/icons/IconProps';

const Webcam02 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M8 22h8m4.5-11.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0m-5.312 0a3.188 3.188 0 1 1-6.376 0 3.188 3.188 0 0 1 6.376 0"
        />
    </svg>
);
export default Webcam02;
