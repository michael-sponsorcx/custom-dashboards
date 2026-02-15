import { CXIconProps } from '@/assets/icons/IconProps';

const ZapOff = ({ color, size = '16' }: CXIconProps) => (
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
            d="m8 7-3.907 4.688c-.348.418-.523.628-.525.804a.5.5 0 0 0 .185.397c.138.111.41.111.955.111H12l-1 8 5-6m-.35-6h3.642c.545 0 .817 0 .955.111a.5.5 0 0 1 .185.397c-.002.176-.177.386-.525.804L18.55 11.94m-7.977-8.027L13 1l-.6 4.798M21 20 3 2"
        />
    </svg>
);
export default ZapOff;
