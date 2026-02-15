import { CXIconProps } from '@/assets/icons/IconProps';

const Loading03 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M3.34 16a4.773 4.773 0 0 1 1.458-6.34l.002-.002a4.78 4.78 0 0 1 5.484.094l3.432 2.496a4.78 4.78 0 0 0 5.485.094l.002-.002A4.77 4.77 0 0 0 20.66 6m-3.658 13.66a4.774 4.774 0 0 1-6.34-1.458l-.002-.003a4.78 4.78 0 0 1 .095-5.484l2.495-3.432a4.78 4.78 0 0 0 .094-5.484l-.004-.002A4.77 4.77 0 0 0 7 2.34M19.07 3.93c3.906 3.905 3.906 10.236 0 14.141-3.905 3.906-10.236 3.906-14.141 0-3.905-3.905-3.905-10.236 0-14.141s10.236-3.905 14.141 0"
        />
    </svg>
);
export default Loading03;
