import { CXIconProps } from '@/assets/icons/IconProps';

const BluetoothOn = ({ color, size = '16' }: CXIconProps) => (
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
            d="m6 7 12 10-6 5V2l6 5L6 17"
        />
    </svg>
);
export default BluetoothOn;
