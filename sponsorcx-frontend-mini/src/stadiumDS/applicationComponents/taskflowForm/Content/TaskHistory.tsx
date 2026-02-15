import { useUserOptions } from '@/hooks/useUserOptions';
import { useTypeOptions } from '@/hooks/useTypeOptions';
import { ObjectType } from '@/gql/customFieldGql';
import { GenericTask } from '@/gql/genericTask';
import { usePropertyOptions } from '@/hooks/usePropertyOptions';
import useCustomFields from '@/hooks/useCustomFields';
import { useGenericTaskHistory } from '@/hooks/useGenericTaskHistory';
import { useGenericTaskStatuses } from '@/hooks/useGenericTaskStatuses';
import { useGenericTaskTemplates } from '@/hooks/useGenericTaskTemplates';
import { HistoryType } from '../../FormSlideOut/components/HistorySection/HistorySection.type';
import { HistorySection } from '../../FormSlideOut/components/HistorySection/HistorySection';

export const TaskHistory = ({ task }: { task: GenericTask | undefined }) => {
    const propertyOptions = usePropertyOptions();
    const userOptions = useUserOptions();
    const typeOptions = useTypeOptions();
    const { statusOptions } = useGenericTaskStatuses();
    const statusOptionsFiltered = statusOptions.map((option) => ({
        value: option.value,
        text: option.label,
    }));
    const { templateOptions } = useGenericTaskTemplates();
    const templateOptionsFiltered = templateOptions.map((option) => ({
        value: option.value,
        text: option.label,
    }));
    const { customFields: customFieldOptions } = useCustomFields({
        objectType: ObjectType.GENERIC_TASK,
    });

    const { data: history } = useGenericTaskHistory(task?.id);

    return (
        <HistorySection
            title="Task History"
            history={history}
            actionType={{
                type: HistoryType.PROPERTY_GENERIC_TASK,
                options: {
                    userOptions,
                    propertyOptions,
                    typeOptions,
                    customFieldOptions,
                    statusOptions: statusOptionsFiltered,
                    templateOptions: templateOptionsFiltered,
                },
            }}
        />
    );
};
