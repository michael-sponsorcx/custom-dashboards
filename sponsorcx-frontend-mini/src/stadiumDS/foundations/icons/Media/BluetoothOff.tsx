import { CXIconProps } from '@/assets/icons/IconProps';

const BluetoothOff = ({ color, size = '16' }: CXIconProps) => (
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
            d="m6 17 6-5v10l5.44-4.533M12 7V2l6 5-2.918 2.432M21 21 3 3"
        />
    </svg>
);
export default BluetoothOff;
