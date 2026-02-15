import { CXIconProps } from '@/assets/icons/IconProps';

const dMap = {
    '1': 'M21 14v1.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C18.72 20 17.88 20 16.2 20H7.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C3 17.72 3 16.88 3 15.2V14m14-7-5-5m0 0L7 7m5-5v12',
    '2': 'M21 2H3m15 10-6-6m0 0-6 6m6-6v14',
    '3': 'm16 11-4-4m0 0-4 4m4-4v8m10-4c0 5.523-4.477 10-10 10S2 16.523 2 11 6.477 1 12 1s10 4.477 10 10',
    '4': 'm16 11-4-4m0 0-4 4m4-4v9.2c0 1.39 0 2.086.55 2.865.366.517 1.42 1.155 2.047 1.24.945.128 1.304-.059 2.022-.433A10 10 0 0 0 22 11c0-5.523-4.477-10-10-10S2 5.477 2 11a10 10 0 0 0 5 8.662',
    'cloud-1':
        'M4 15.242A4.5 4.5 0 0 1 6.08 7.02a6.002 6.002 0 0 1 11.84 0A4.5 4.5 0 0 1 20 15.242M8 15l4-4m0 0 4 4m-4-4v9',
    'cloud-2':
        'm8 15 4-4m0 0 4 4m-4-4v9m8-4.257A5.5 5.5 0 0 0 16.5 6a.62.62 0 0 1-.534-.302 7.5 7.5 0 1 0-11.78 9.096',
};

interface UploadProps extends CXIconProps {
    variant: keyof typeof dMap;
}

const Upload = ({ color, size = '16', variant }: UploadProps) => (
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
export default Upload;
