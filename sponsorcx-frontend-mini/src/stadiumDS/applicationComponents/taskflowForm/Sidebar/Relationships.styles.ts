import colors from '@/stadiumDS/foundations/colors';
import styled, { css } from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
    overflow-x: hidden;
`;

export const Field = styled.div<{ $overflow?: string }>`
    display: flex;
    align-items: center;
    width: 100%;
    height: 20px;

    overflow: ${({ $overflow }) => $overflow || 'hidden'};
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const FieldLabel = styled.div<{ $highlight?: boolean }>`
    align-items: center;
    display: flex;
    gap: 8px;
    border-radius: 4px;
    height: 20px;
    width: 162px;
    white-space: nowrap;

    ${({ $highlight }) =>
        $highlight &&
        css`
            border: 1px solid ${colors.Error[500]};
        `}
`;

export const FieldValue = styled.div`
    align-items: center;
    display: flex;
    gap: 8px;
    flex: 1;
    width: 100%;
`;

export const FieldValueHover = styled(FieldValue)`
    padding-left: 10.5px;
    padding-right: 10.5px;

    &:hover {
        border-radius: 8px;
        background-color: ${colors.Gray[50]};
    }
`;
