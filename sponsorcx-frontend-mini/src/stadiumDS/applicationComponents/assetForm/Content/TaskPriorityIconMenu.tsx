import { BAssetTaskPriorities } from '@/gql/bAssetTasksGql';
import colors from '@/stadiumDS/foundations/colors';
import Flag from '@/stadiumDS/foundations/icons/Maps/Flag';
import { SelectMenu } from '@/stadiumDS/sharedComponents/menu/SelectMenu';
import { UnstyledButton } from '@mantine/core';
import { forwardRef } from 'react';

export const priorityIcons = {
    [BAssetTaskPriorities.HIGH]: {
        name: 'High',
        component: <Flag color={colors.Error[500]} size={'16'} variant={'2'} />,
    },
    [BAssetTaskPriorities.MEDIUM]: {
        name: 'Medium',
        component: (
            <Flag color={colors.Warning[500]} size={'16'} variant={'2'} />
        ),
    },
    [BAssetTaskPriorities.LOW]: {
        name: 'Low',
        component: <Flag color={colors.Brand[400]} size={'16'} variant={'2'} />,
    },
};

interface PriorityItem {
    label: string;
    value: BAssetTaskPriorities | null;
    component: React.ReactNode;
}

const priorityItems: PriorityItem[] = [
    ...Object.entries(priorityIcons).map(([key, priority]) => ({
        label: priority.name,
        value: key as BAssetTaskPriorities,
        component: priority.component,
    })),
    {
        label: 'None',
        value: null,
        component: <Flag color={colors.Gray[400]} size={'16'} variant={'2'} />,
    },
];

export const TaskPriorityIconMenu = forwardRef<
    HTMLDivElement,
    {
        priority?: BAssetTaskPriorities | null;
        onUpdate: (priority: BAssetTaskPriorities | null) => void;
        onClose?: () => void;
        withinPortal?: boolean;
        excludeNoneOption?: boolean;
        isDisabled?: boolean;
    }
>(
    (
        {
            priority,
            onUpdate,
            onClose,
            withinPortal = false,
            excludeNoneOption = false,
            isDisabled = false,
        },
        ref
    ) => {
        const priorityItem = priorityItems.find(
            (item) => item.value === (priority ?? null)
        );
        return (
            <SelectMenu
                trigger={
                    <UnstyledButton
                        style={{
                            height: '16px',
                            cursor: isDisabled ? 'not-allowed' : 'default',
                        }}
                    >
                        {priorityItem?.component}
                    </UnstyledButton>
                }
                items={priorityItems
                    .filter((item) => {
                        if (excludeNoneOption) {
                            return item.value !== null;
                        }
                        return true;
                    })
                    .map((item) => ({
                        label: item.label,
                        value: item.value,
                        onClick: (value: BAssetTaskPriorities | null) =>
                            onUpdate(value),
                        leftSection: item.component,
                    }))}
                withinPortal={withinPortal}
                ref={ref}
                value={priority}
                onClose={onClose}
                disabled={isDisabled}
            />
        );
    }
);
