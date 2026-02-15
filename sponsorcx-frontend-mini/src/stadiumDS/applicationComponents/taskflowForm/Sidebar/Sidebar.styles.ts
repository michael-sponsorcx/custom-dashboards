import styled from 'styled-components';
import colors from '@/stadiumDS/foundations/colors';

export const HorizontalRule = styled.hr`
    background: ${colors.Gray[200]};
    border: none;
    box-sizing: border-box;
    height: 1px;
    margin: 4px 0;
    width: 100%;
    display: flex;
    flex-shrink: 0;
`;

export const Header = styled.h4`
    color: ${colors.Gray[500]};
    margin: 0;
    padding: 0;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 20px; /* 142.857% */
`;

export const HeightSpacer = styled.div`
    display: flex;
    flex: 1;
    min-height: 8px;
`;

export const OptionWrapper = styled.div<{ $isSelected?: boolean }>`
    align-items: center;
    display: flex;
    gap: 8px;
    width: ${({ $isSelected }) =>
        $isSelected ? 'calc(130px - 12px)' : 'calc(140px - 12px)'};

    > img,
    > svg {
        flex-shrink: 0;
    }
`;

export const OptionLabel = styled.div`
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const OptionUnselect = styled.div`
    color: ${colors.Gray[700]};
    font-family: Inter;
    font-size: 14px;
    font-style: italic;
    font-weight: 400;
    line-height: 20px; /* 142.857% */
`;
