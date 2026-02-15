import colors from '@/stadiumDS/foundations/colors';
import styled from 'styled-components';

export const Container = styled.div`
    box-sizing: border-box;
`;

export const Grid = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
`;

export const FileImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 8px;
`;

export const FileButton = styled.button<{
    $disabled?: boolean;
    $highlight?: boolean;
    $isHovering?: boolean;
}>`
    display: flex;
    width: 49px;
    height: 49px;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    transition: all 0.2s ease-in-out;
    cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
    margin-right: 7px;
    padding: 0;
    outline: inherit;
    border: none;
    position: relative;
    box-shadow: ${({ $highlight, $isHovering }) =>
        $isHovering
            ? `0 4px 8px rgba(0, 0, 0, 0.1)`
            : $highlight
            ? `0 0 0 2px ${colors.Brand[400]}`
            : 'none'};
    overflow: hidden;
    transform: ${({ $isHovering }) => ($isHovering ? 'scale(1.05)' : 'none')};
`;

export const FileUploadButton = styled(FileButton)`
    border: 1px dashed ${colors.Gray[200]};
    background-color: ${colors.Base.White};

    &:hover {
        transition: all 0.25s ease;
        background: ${colors.Gray[25]};
        box-shadow: none;
    }
`;

export const TrashContainer = styled.div<{ $isVisible: boolean }>`
    opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
    position: absolute;
    top: -4px;
    right: -4px;
    background-color: ${colors.Gray[200]};
    border-radius: 50%;
    width: 20px;
    height: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease-in-out;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    &:hover {
        background-color: ${colors.Gray[300]};
    }
`;
