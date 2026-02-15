import { Avatar, getNameFromObj } from '@/components/UserInfo';
import { User } from '@/gql/types';
import colors from '@/stadiumDS/foundations/colors';
import Plus from '@/stadiumDS/foundations/icons/General/Plus';
import { Flex, Text, Tooltip } from '@mantine/core';
import * as S from './AssigneesSelectTrigger.styles';

export const getAssigneesSelectTrigger = (
    assigneeUsers: User[],
    includeSingleUserName = false
) => {
    const assigneeCount = assigneeUsers.length;
    let displayAssignees = [...assigneeUsers];

    if (assigneeCount === 0) {
        return (
            <S.EmptyPlusContainer>
                <Plus size="16" color={colors.Gray[400]} />
            </S.EmptyPlusContainer>
        );
    }
    if (assigneeCount > 3) {
        displayAssignees = displayAssignees.slice(0, 2);
    }
    return (
        <Tooltip
            label={assigneeUsers.map((user) => getNameFromObj(user)).join(', ')}
            disabled={assigneeCount === 0}
            withinPortal
            style={{
                maxWidth: '200px',
                textAlign: 'center',
            }}
            multiline
        >
            <Flex align="center">
                {displayAssignees.map((user: User, index: number) => {
                    return (
                        <S.AvatarContainer
                            key={`assignee-avatar-${user.id}`}
                            $zIndex={index}
                        >
                            <Avatar user={user} size={24} removeMargin />
                        </S.AvatarContainer>
                    );
                })}
                {assigneeCount > 3 && (
                    <S.AvatarContainer $zIndex={2}>
                        <S.PlusContainer>+{assigneeCount - 2}</S.PlusContainer>
                    </S.AvatarContainer>
                )}
                {includeSingleUserName && assigneeCount === 1 && (
                    <Text truncate style={{ marginLeft: 12 }}>
                        {getNameFromObj(assigneeUsers[0])}
                    </Text>
                )}
            </Flex>
        </Tooltip>
    );
};
