import { CXIconProps } from '@/assets/icons/IconProps';

const FileShield03 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M14 2H8.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C4 4.28 4 5.12 4 6.8v10.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C6.28 22 7.12 22 8.8 22h6.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C20 19.72 20 18.88 20 17.2V8m-6-6 6 6m-6-6v6h6m-8 10s3-1.43 3-3.575v-2.502l-2.188-.782a2.4 2.4 0 0 0-1.626 0L9 11.923v2.502C9 16.57 12 18 12 18"
        />
    </svg>
);
export default FileShield03;
