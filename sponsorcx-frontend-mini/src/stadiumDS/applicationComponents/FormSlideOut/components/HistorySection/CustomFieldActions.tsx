import { RecordHistory } from '@/gql/recordHistoryGql';
import {
    HistoryTextToken,
    HistoryTextUnknown,
} from '@/stadiumDS/applicationComponents/assetForm/Content/AssetHistory.styles';

const getItemValues = (item: RecordHistory) => {
    return {
        label: item.metadata?.customFieldLabel
            ? (item.metadata.customFieldLabel as string)
            : 'a custom field',
        value: item.action_value,
    };
};

export const CustomFieldMultiSelectAddedAction = ({
    item,
}: {
    item: RecordHistory;
}) => {
    const { label, value } = getItemValues(item);

    if (!value) {
        return (
            <div>
                added <HistoryTextUnknown>empty value</HistoryTextUnknown> to{' '}
                {label}
            </div>
        );
    }

    return (
        <div>
            added <HistoryTextToken>{value}</HistoryTextToken> to {label}
        </div>
    );
};

export const CustomFieldMultiSelectRemovedAction = ({
    item,
}: {
    item: RecordHistory;
}) => {
    const { label, value } = getItemValues(item);

    if (!value) {
        return (
            <div>
                removed <HistoryTextUnknown>empty value</HistoryTextUnknown>{' '}
                from {label}
            </div>
        );
    }

    return (
        <div>
            removed <HistoryTextToken>{value}</HistoryTextToken> from {label}
        </div>
    );
};

export const CustomFieldSelectUpdatedAction = ({
    item,
}: {
    item: RecordHistory;
}) => {
    const { label, value } = getItemValues(item);

    if (!value) {
        return <div>removed {label}</div>;
    }

    return (
        <div>
            updated {label} to <HistoryTextToken>{value}</HistoryTextToken>
        </div>
    );
};

export const CustomFieldNumberUpdatedAction = ({
    item,
}: {
    item: RecordHistory;
}) => {
    const { label, value } = getItemValues(item);

    if (!value) {
        return <div>removed {label}</div>;
    }

    return (
        <div>
            updated {label} to <HistoryTextToken>{value}</HistoryTextToken>
        </div>
    );
};

export const CustomFieldDateUpdatedAction = ({
    item,
}: {
    item: RecordHistory;
}) => {
    const { label, value } = getItemValues(item);

    if (!value) {
        return <div>removed {label}</div>;
    }

    return (
        <div>
            updated {label} to <HistoryTextToken>{value}</HistoryTextToken>
        </div>
    );
};

export const CustomFieldPercentageUpdatedAction = ({
    item,
}: {
    item: RecordHistory;
}) => {
    const { label, value } = getItemValues(item);

    if (!value) {
        return <div>removed {label}</div>;
    }

    return (
        <div>
            updated {label} to <HistoryTextToken>{value}</HistoryTextToken>
        </div>
    );
};

export const CustomFieldRichTextUpdatedAction = ({
    item,
}: {
    item: RecordHistory;
}) => {
    const { label, value } = getItemValues(item);

    if (!value) {
        return <div>removed {label}</div>;
    }

    return (
        <div>
            updated {label} to <HistoryTextToken>{value}</HistoryTextToken>
        </div>
    );
};

export const CustomFieldHyperlinkUpdatedAction = ({
    item,
}: {
    item: RecordHistory;
}) => {
    const { label, value } = getItemValues(item);

    if (!value) {
        return <div>removed {label}</div>;
    }

    return (
        <div>
            updated {label} to <HistoryTextToken>{value}</HistoryTextToken>
        </div>
    );
};

export const CustomFieldBooleanUpdatedAction = ({
    item,
}: {
    item: RecordHistory;
}) => {
    const { label, value } = getItemValues(item);

    if (!value || (value !== 'true' && value !== 'false')) {
        return <div>removed {label}</div>;
    }

    return (
        <div>
            updated {label} to{' '}
            <HistoryTextToken>
                {value === 'true' ? 'Yes' : 'No'}
            </HistoryTextToken>
        </div>
    );
};

export const CustomFieldStringUpdatedAction = ({
    item,
}: {
    item: RecordHistory;
}) => {
    const { label, value } = getItemValues(item);

    if (!value) {
        return <div>removed {label}</div>;
    }

    return (
        <div>
            updated {label} to <HistoryTextToken>{value}</HistoryTextToken>
        </div>
    );
};
