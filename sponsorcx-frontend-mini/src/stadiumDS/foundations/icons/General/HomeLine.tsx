import { CXIconProps } from '@/assets/icons/IconProps';

const HomeLine = ({ color, size = '16' }: CXIconProps) => (
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
            d="M8 16h8M11.018 1.764 4.235 7.039c-.453.353-.68.53-.843.75a2 2 0 0 0-.318.65C3 8.704 3 8.991 3 9.565V16.8c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C4.52 20 5.08 20 6.2 20h11.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C21 18.48 21 17.92 21 16.8V9.565c0-.574 0-.861-.074-1.126a2 2 0 0 0-.318-.65c-.163-.22-.39-.397-.843-.75l-6.783-5.275c-.351-.273-.527-.41-.72-.462a1 1 0 0 0-.523 0c-.194.052-.37.189-.721.462"
        />
    </svg>
);
export default HomeLine;
