import colors from '@/stadiumDS/foundations/colors';
import styled from 'styled-components';

export const Container = styled.div<{ isDragging?: boolean }>`
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 16px 24px;
    background: ${colors.Base.White};
    border-radius: 12px;
    border: ${({ isDragging }) =>
        isDragging
            ? `2px solid ${colors.Brand[400]}`
            : `1px solid ${colors.Gray[200]}`};
    margin: ${({ isDragging }) => (isDragging ? '-1px' : '0')};
    &:hover {
        border: 2px solid ${colors.Brand[400]};
        margin: -1px;
    }
`;

export const IconContainer = styled.div`
    display: flex;
    width: fit-content;
    padding: 10px;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    border: 1px solid ${colors.Gray[200]};
    box-shadow: 0px 0px 0px 1px rgba(10, 13, 18, 0.18) inset,
        0px -2px 0px 0px rgba(10, 13, 18, 0.05) inset,
        0px 1px 2px 0px rgba(16, 24, 40, 0.05);
    background-color: ${colors.Base.White};
`;

export const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
`;

export const UploadTextContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
`;
