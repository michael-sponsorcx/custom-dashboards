import colors from '@/stadiumDS/foundations/colors';
import styled, { css } from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    overflow-x: hidden;
`;

export const Field = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    height: 28px;
    flex-shrink: 0;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    opacity: 1;
    transition-duration: 100ms;
    transition-timing-function: ease;
    transition-property: transform, opacity, max-height, margin, gap;
`;

export const FieldLabel = styled.div<{ $highlight?: boolean }>`
    align-items: center;
    display: flex;
    gap: 0px;
    border-radius: 4px;

    height: 28px;
    width: 132px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    color: ${colors.Gray[500]};

    /* Text sm/Regular */
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px; /* 142.857% */

    ${({ $highlight }) =>
        $highlight &&
        css`
            border: 1px solid ${colors.Error[500]};
        `}

    > img,
    > svg {
        flex-shrink: 0;
    }

    > *:not(:first-child) {
        margin-left: 8px;
    }
`;

export const FieldValue = styled.div`
    align-items: center;
    display: flex;
    gap: 8px;
    flex: 1;
    width: 110px;
`;

export const FieldValueHover = styled(FieldValue)`
    padding-left: 10.5px;
    padding-right: 10.5px;

    &:hover {
        border-radius: 8px;
        background-color: ${colors.Gray[50]};
    }
`;
