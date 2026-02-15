import styled from 'styled-components';

export const HoverIconContainer = styled.div<{ $hoverColor?: string }>`
    display: inline-block;
    cursor: pointer;

    &:hover {
        path {
            stroke: ${({ $hoverColor }) => $hoverColor};
        }
    }
`;
