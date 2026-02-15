import { CXIconProps } from '@/assets/icons/IconProps';

const Webcam01 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M12 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16m0 0v4m0 0H7m5 0h5m-2-12a3 3 0 1 1-6 0 3 3 0 0 1 6 0"
        />
    </svg>
);
export default Webcam01;
