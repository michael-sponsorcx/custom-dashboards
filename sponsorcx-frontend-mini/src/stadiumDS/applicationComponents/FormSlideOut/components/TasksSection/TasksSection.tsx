import { Button, Menu, Stack, Text } from '@mantine/core';
import { MainPanelSection } from '../MainPanelSection';
import colors from '@/stadiumDS/foundations/colors';
import Plus from '@/stadiumDS/foundations/icons/General/Plus';
import {
    TasksSectionTask,
    TasksSectionTemplateProps,
    TaskUploadProps,
} from './TasksSection.type';
import { TasksSectionRow } from './TasksSectionRow';
import { CXLink } from '@/components/CXLink';
import { Item } from '@/stadiumDS/sharedComponents/menu/SelectMenu';

interface TasksSectionProps {
    title?: string;
    tasks: TasksSectionTask[];
    onUpdateTask: (task: TasksSectionTask) => void;
    onAddTask: () => void;
    uploadProps: TaskUploadProps;
    onDeleteTask: (taskId: string) => void;
    templateProps?: TasksSectionTemplateProps;
    highlightedTaskId?: string;
    statusOptions?: Omit<Item, 'onClick'>[];
    priorityOptions?: Omit<Item, 'onClick'>[];
    userOptions?: Omit<Item, 'onClick'>[];
    isTileView?: boolean;
    canEdit?: boolean;
}

export const TasksSection = ({
    title = 'Tasks',
    tasks,
    onUpdateTask,
    onAddTask,
    uploadProps,
    onDeleteTask,
    templateProps,
    highlightedTaskId,
    statusOptions,
    priorityOptions,
    userOptions,
    isTileView = false,
    canEdit = false,
}: TasksSectionProps) => {
    return (
        <MainPanelSection
            title={title}
            minHeight="150px"
            extraHeaderContent={
                !canEdit ? null : templateProps ? (
                    <Menu>
                        <Menu.Target>
                            <Button
                                variant="outline"
                                leftSection={
                                    <Plus color={colors.Gray[700]} size="12" />
                                }
                            >
                                Task
                            </Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item key={'add-task'} onClick={onAddTask}>
                                Add Task
                            </Menu.Item>
                            <Menu.Sub>
                                <Menu.Sub.Target>
                                    <Menu.Sub.Item key={'add-template-task'}>
                                        Add Template Task
                                    </Menu.Sub.Item>
                                </Menu.Sub.Target>
                                <Menu.Sub.Dropdown>
                                    {templateProps.templates.map((template) => (
                                        <Menu.Item
                                            key={template.id}
                                            onClick={() =>
                                                templateProps.onAddTemplateTasks(
                                                    template.id
                                                )
                                            }
                                        >
                                            {template.name}
                                        </Menu.Item>
                                    ))}
                                    <Menu.Item key={'manage-templates'}>
                                        <CXLink
                                            to={
                                                templateProps.linkToManageTemplates
                                            }
                                        >
                                            Manage Templates
                                        </CXLink>
                                    </Menu.Item>
                                </Menu.Sub.Dropdown>
                            </Menu.Sub>
                        </Menu.Dropdown>
                    </Menu>
                ) : (
                    <Button
                        variant="outline"
                        leftSection={
                            <Plus color={colors.Gray[700]} size="12" />
                        }
                        onClick={onAddTask}
                    >
                        Task
                    </Button>
                )
            }
        >
            <Stack style={{ width: '100%', gap: '6px' }}>
                {tasks.length === 0 ? (
                    <Text c={colors.Gray[400]}>No task currently added</Text>
                ) : (
                    tasks.map((task) => (
                        <TasksSectionRow
                            key={task.id}
                            task={task}
                            onUpdateTask={onUpdateTask}
                            uploadProps={uploadProps}
                            onDeleteTask={onDeleteTask}
                            highlighted={highlightedTaskId === task.id}
                            statusOptions={statusOptions}
                            priorityOptions={priorityOptions}
                            userOptions={userOptions}
                            isTileView={isTileView}
                            canEdit={canEdit}
                        />
                    ))
                )}
            </Stack>
        </MainPanelSection>
    );
};
