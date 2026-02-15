import { CXIconProps } from '@/assets/icons/IconProps';

const dMap = {
    '1': 'M14.5 15L17.5 12L14.5 9M9.5 9L6.5 12L9.5 15M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z',
    '2': 'M14 17L17 14L14 11M10 7L7 10L10 13M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z',
    '3': 'M15.5 15L18.5 12L15.5 9M8.5 9L5.5 12L8.5 15M13 7L11 17M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z',
} as const;

interface CodeCircleProps extends CXIconProps {
    variant: keyof typeof dMap;
}

const CodeCircle = ({ color, size = '16', variant }: CodeCircleProps) => (
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

export default CodeCircle;
