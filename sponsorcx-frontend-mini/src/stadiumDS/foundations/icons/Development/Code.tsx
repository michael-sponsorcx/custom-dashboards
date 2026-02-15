import { CXIconProps } from '@/assets/icons/IconProps';

const dMap = {
    '1': 'M16 18L22 12L16 6M8 6L2 12L8 18',
    '2': 'M17 17L22 12L17 7M7 7L2 12L7 17M14 3L10 21',
} as const;

interface CodeProps extends CXIconProps {
    variant: keyof typeof dMap;
}

const Code = ({ color, size = '16', variant }: CodeProps) => (
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

export default Code;
