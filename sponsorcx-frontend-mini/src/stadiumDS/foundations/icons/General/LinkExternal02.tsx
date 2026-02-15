import { CXIconProps } from '@/assets/icons/IconProps';

const LinkExternal02 = ({ color, size = '16' }: CXIconProps) => (
    <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill="none"
    >
        <g transform="translate(0,1)">
            <path
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 8V2m0 0h-6m6 0-9 9m-2-9H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 4.28 3 5.12 3 6.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 20 6.12 20 7.8 20h8.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C21 17.72 21 16.88 21 15.2V13"
            />
        </g>
    </svg>
);
export default LinkExternal02;
