import colors from '@/stadiumDS/foundations/colors';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const TabContainer = styled(Link)<{
    $active?: boolean;
    $isSubTab?: boolean;
}>`
    display: flex;
    align-items: center;
    cursor: pointer;
    border-radius: 6px;
    padding: 8px 12px;
    background-color: ${({ $active }) =>
        $active ? colors.Gray[200] : 'transparent'};
    transition: all 150ms ease;

    &:hover {
        background-color: ${({ $active, $isSubTab }) =>
            $active
                ? colors.Gray[200]
                : $isSubTab
                ? colors.Gray[100]
                : colors.Gray[50]};
    }
`;

export const ChevronContainer = styled.div<{ $expanded?: boolean }>`
    height: 20px;
    width: 20px;
    transform: rotate(${({ $expanded }) => ($expanded ? '-180deg' : '0deg')});
    transition: transform 300ms ease;
`;

export const ExpandableTabContainer = styled.div<{
    $active?: boolean;
    $expanded?: boolean;
}>`
    display: flex;
    flex-direction: column;
    cursor: pointer;
    gap: 8px;
    padding: 8px 12px;
    border-radius: ${({ $expanded }) => ($expanded ? '16px' : '6px')};
    background-color: ${({ $active }) =>
        $active ? colors.Gray[50] : 'transparent'};
    transition: all 150ms ease;

    &:hover {
        background-color: ${colors.Gray[50]};
    }
`;
