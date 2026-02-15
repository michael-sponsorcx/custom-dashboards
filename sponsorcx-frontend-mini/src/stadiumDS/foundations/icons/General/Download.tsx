import { CXIconProps } from '@/assets/icons/IconProps';

const dMap = {
    '1': 'M21 14v1.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C18.72 20 17.88 20 16.2 20H7.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C3 17.72 3 16.88 3 15.2V14m14-5-5 5m0 0L7 9m5 5V2',
    '2': 'M21 20H3m15-10-6 6m0 0-6-6m6 6V2',
    '3': 'm8 11 4 4m0 0 4-4m-4 4V7m10 4c0 5.523-4.477 10-10 10S2 16.523 2 11 6.477 1 12 1s10 4.477 10 10',
    '4': 'm8 11 4 4m0 0 4-4m-4 4V5.8c0-1.39 0-2.086-.55-2.865-.366-.517-1.42-1.155-2.047-1.24-.945-.128-1.304.059-2.022.433A10 10 0 0 0 2 11c0 5.523 4.477 10 10 10s10-4.477 10-10a10 10 0 0 0-5-8.662',
};

interface DownloadProps extends CXIconProps {
    variant: keyof typeof dMap;
}

const Download = ({ color, size = '16', variant }: DownloadProps) => (
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
export default Download;
