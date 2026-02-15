import { CXIconProps } from '@/assets/icons/IconProps';

const dMap = {
    '1': 'm12.708 17.364-1.415 1.414a5 5 0 1 1-7.07-7.07l1.413-1.415m12.728 1.414 1.415-1.414a5 5 0 0 0-7.071-7.071l-1.415 1.414M8.5 14.5l7-7',
    '2': 'M9 16H7A5 5 0 0 1 7 6h2m6 10h2a5 5 0 0 0 0-10h-2m-8 5h10',
    '3': 'M10 12a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 10a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
    '4': 'M7.5 6H7a5 5 0 0 0 0 10h2a5 5 0 0 0 5-5m2.5 5h.5a5 5 0 0 0 0-10h-2a5 5 0 0 0-5 5',
    '5': 'M9 16H7A5 5 0 0 1 7 6h2m-1 5h10m-2.222 5H17a5 5 0 0 0 0-10h-1.222a.78.78 0 0 0-.778.778v8.444c0 .43.348.778.778.778',
};

interface LinkProps extends CXIconProps {
    variant: keyof typeof dMap;
}

const Link = ({ color, size = '16', variant }: LinkProps) => (
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
            d={dMap[variant]}
        />
    </svg>
);
export default Link;
