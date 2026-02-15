import { SidePanelBooleanField } from './SidePanelBooleanField';
import { SidePanelDateField } from './SidePanelDateField';
import {
    SidePanelFieldProps,
    SidePanelFieldTypes,
} from './SidePanelFields.types';
import { SidePanelFileField } from './SidePanelFileField';
import { SidePanelLinkField } from './SidePanelLinkField';
import { SidePanelMultiSelectField } from './SidePanelMultiSelectField';
import { SidePanelNumberField } from './SidePanelNumberField';
import { SidePanelReadOnlyField } from './SidePanelReadOnlyField';
import { SidePanelReadOnlyLinkField } from './SidePanelReadOnlyLinkField';
import { SidePanelSelectField } from './SidePanelSelectField';
import { SidePanelTextField } from './SidePanelTextField';
import { SidePanelUserMultiSelect } from './SidePanelUserMultiSelect';

export const SidePanelField = (props: SidePanelFieldProps) => {
    switch (props.type) {
        case SidePanelFieldTypes.TEXT:
            return <SidePanelTextField {...props} />;
        case SidePanelFieldTypes.NUMBER:
            return <SidePanelNumberField {...props} />;
        case SidePanelFieldTypes.BOOLEAN:
            return <SidePanelBooleanField {...props} />;
        case SidePanelFieldTypes.SELECT:
            return <SidePanelSelectField {...props} />;
        case SidePanelFieldTypes.MULTI_SELECT:
            return <SidePanelMultiSelectField {...props} />;
        case SidePanelFieldTypes.DATE:
            return <SidePanelDateField {...props} />;
        case SidePanelFieldTypes.FILE:
            return <SidePanelFileField {...props} />;
        case SidePanelFieldTypes.LINK:
            return <SidePanelLinkField {...props} />;
        case SidePanelFieldTypes.USER_MULTI_SELECT:
            return <SidePanelUserMultiSelect {...props} />;
        case SidePanelFieldTypes.READ_ONLY:
            return <SidePanelReadOnlyField {...props} />;
        case SidePanelFieldTypes.READ_ONLY_LINK:
            return <SidePanelReadOnlyLinkField {...props} />;
        default:
            return null;
    }
};
