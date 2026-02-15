import colors from '@/stadiumDS/foundations/colors';
import styled from 'styled-components';

export const Card = styled.div<{ $selected: boolean }>`
    width: 100%;
    aspect-ratio: 1/1;
    background-color: ${({ $selected }) =>
        $selected ? colors.Gray[200] : colors.Gray[100]};
    padding: 16px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    overflow: hidden;

    &:hover {
        background-color: ${colors.Gray[200]};
    }
`;

export const CardContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    cursor: pointer;

    &:hover {
        ${Card} {
            background-color: ${colors.Gray[200]};
        }
    }
`;
