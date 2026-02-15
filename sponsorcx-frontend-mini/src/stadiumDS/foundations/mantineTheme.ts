import {
    createTheme,
    rem,
    MantineColorsTuple,
    MantineTheme,
    Button,
} from '@mantine/core';
import Chevron from '@/stadiumDS/foundations/icons/Arrows/Chevron';
import colors from './colors';
import datePickerClasses from './mantineComponentStyles/DatePicker.module.css';
import dateInputClasses from './mantineComponentStyles/DateInput.module.css';
import buttonClasses from './mantineComponentStyles/Button.module.css';
import textInputClasses from './mantineComponentStyles/TextInput.module.css';
import modalClasses from './mantineComponentStyles/Modal.module.css';
import tabsClasses from './mantineComponentStyles/Tabs.module.css';
import multiSelectClasses from './mantineComponentStyles/MultiSelect.module.css';
import selectClasses from './mantineComponentStyles/Select.module.css';
import tooltipClasses from './mantineComponentStyles/Tooltip.module.css';
import numberInputClasses from './mantineComponentStyles/NumberInput.module.css';
import checkboxClasses from './mantineComponentStyles/Checkbox.module.css';
import actionButtonClasses from './mantineComponentStyles/ActionButton.module.css';
import switchClasses from './mantineComponentStyles/Switch.module.css';
import comboboxClasses from './mantineComponentStyles/Combobox.module.css';
import tagsInputClasses from './mantineComponentStyles/TagsInput.module.css';
import dropzoneClasses from './mantineComponentStyles/Dropzone.module.css';
import popoverClasses from './mantineComponentStyles/Popover.module.css';
import menuClasses from './mantineComponentStyles/Menu.module.css';
import pillClasses from './mantineComponentStyles/Pill.module.css';
import segmentedControlClasses from './mantineComponentStyles/SegmentedControl.module.css';
import radioClasses from './mantineComponentStyles/Radio.module.css';
import { getDateInputFormat } from '@/utils/helpers';

// Helper function to convert object format to array format
function convertToColorTuple(
    colorObj: Record<string | number, string>
): MantineColorsTuple {
    // Mantine expects a 10-element array at minimum
    return [
        colorObj[25] || colorObj['25'] || '',
        colorObj[50] || colorObj['50'] || '',
        colorObj[100] || colorObj['100'] || '',
        colorObj[200] || colorObj['200'] || '',
        colorObj[300] || colorObj['300'] || '',
        colorObj[400] || colorObj['400'] || '',
        colorObj[500] || colorObj['500'] || '',
        colorObj[600] || colorObj['600'] || '',
        colorObj[700] || colorObj['700'] || '',
        colorObj[800] || colorObj['800'] || '',
        colorObj[900] || colorObj['900'] || '',
        colorObj[950] || colorObj['950'] || '',
    ] as MantineColorsTuple;
}

// Convert colors to Mantine format
const mantineColors: Record<string, MantineColorsTuple> = {};
Object.entries(colors).forEach(([colorName, colorValue]) => {
    if (colorName === 'Base') return; // Skip Base as it's not a color scale
    if (typeof colorValue === 'object') {
        mantineColors[colorName] = convertToColorTuple(
            colorValue as Record<string | number, string>
        );
    }
});

export const theme = createTheme({
    colors: mantineColors,
    primaryColor: 'Brand',
    primaryShade: 5,

    fontFamily: 'Inter, sans-serif',

    // Font sizes based on Text.tsx
    fontSizes: {
        xs: rem(12), // TextXs
        sm: rem(14), // TextSm
        md: rem(16), // TextMd
        lg: rem(18), // TextLg
        xl: rem(20), // TextXl
        '2xl': rem(24), // DisplayXs
        '3xl': rem(30), // DisplaySm
        '4xl': rem(36), // DisplayMd
        '5xl': rem(48), // DisplayLg
        '6xl': rem(60), // DisplayXl
        '7xl': rem(72), // Display2xl
    },

    // Line heights based on Text.tsx
    lineHeights: {
        xs: rem(18), // TextXs: 18px
        sm: rem(20), // TextSm: 20px
        md: rem(24), // TextMd: 24px
        lg: rem(28), // TextLg: 28px
        xl: rem(30), // TextXl: 30px
        '2xl': rem(32), // DisplayXs: 32px
        '3xl': rem(38), // DisplaySm: 38px
        '4xl': rem(44), // DisplayMd: 44px
        '5xl': rem(60), // DisplayLg: 60px
        '6xl': rem(72), // DisplayXl: 72px
        '7xl': rem(90), // Display2xl: 90px
    },

    white: colors.Base.White,
    black: colors.Base.Black,

    shadows: {
        xs: '0px 1px 2px 0px rgba(10, 13, 18, 0.05)',
        sm: '0px 1px 3px 0px rgba(10, 13, 18, 0.10), 0px 1px 2px -1px rgba(10, 13, 18, 0.10)',
        md: '0px 4px 6px -1px rgba(10, 13, 18, 0.10), 0px 2px 4px -2px rgba(10, 13, 18, 0.06)',
        lg: '0px 12px 16px -4px rgba(10, 13, 18, 0.08), 0px 4px 6px -2px rgba(10, 13, 18, 0.03), 0px 2px 2px -1px rgba(10, 13, 18, 0.04)',
        xl: '0px 20px 24px -4px rgba(10, 13, 18, 0.08), 0px 8px 8px -4px rgba(10, 13, 18, 0.03), 0px 3px 3px -1.5px rgba(10, 13, 18, 0.04)',
        '2xl': '0px 24px 48px -12px rgba(10, 13, 18, 0.18), 0px 4px 4px -2px rgba(10, 13, 18, 0.04)',
        '3xl': '0px 32px 64px -12px rgba(10, 13, 18, 0.14), 0px 5px 5px -2.5px rgba(10, 13, 18, 0.04)',
    },

    headings: {
        fontFamily: 'Inter, sans-serif',
        sizes: {
            h1: { fontSize: rem(36), lineHeight: rem(44), fontWeight: '700' },
            h2: { fontSize: rem(30), lineHeight: rem(38), fontWeight: '600' },
            h3: { fontSize: rem(24), lineHeight: rem(32), fontWeight: '600' },
            h4: { fontSize: rem(20), lineHeight: rem(30), fontWeight: '600' },
            h5: { fontSize: rem(18), lineHeight: rem(28), fontWeight: '500' },
            h6: { fontSize: rem(16), lineHeight: rem(24), fontWeight: '500' },
        },
    },

    cursorType: 'pointer', // sets the cursor to pointer for Checkbox and NativeSelect -> https://mantine.dev/theming/theme-object/#cursortype

    components: {
        // Global portal configuration for all components that support it
        Checkbox: {
            classNames: checkboxClasses,
        },
        Combobox: {
            defaultProps: {
                withinPortal: false,
            },
            classNames: comboboxClasses,
        },
        Select: {
            classNames: selectClasses,
            defaultProps: {
                rightSection: Chevron({ variant: 'down' }),
                checkIconPosition: 'right',
            },
        },
        Switch: {
            classNames: switchClasses,
            defaultProps: {
                size: 'md',
                withThumbIndicator: false,
            },
        },
        MultiSelect: {
            classNames: multiSelectClasses,
            defaultProps: {
                rightSection: Chevron({ variant: 'down' }),
                checkIconPosition: 'right',
            },
        },
        Menu: {
            defaultProps: {
                withinPortal: false,
                position: 'bottom-end',
            },
            classNames: menuClasses,
        },
        Popover: {
            defaultProps: {
                withinPortal: false,
            },
            classNames: popoverClasses,
        },
        Tooltip: {
            defaultProps: {
                withinPortal: false,
                multiline: true,
            },
            classNames: tooltipClasses,
        },
        Modal: {
            defaultProps: {
                withinPortal: false,
                centered: true,
                overlayProps: {
                    color: colors.Base.White,
                    opacity: 0.75,
                    blur: 4,
                },
            },
            classNames: modalClasses,
        },
        ColorPicker: {
            defaultProps: {
                withinPortal: false,
            },
        },
        Button: Button.extend({
            classNames: buttonClasses,
            defaultProps: {
                variant: 'filled',
            },
        }),
        ActionIcon: {
            classNames: actionButtonClasses,
            defaultProps: {
                variant: 'subtle',
            },
        },
        Tabs: {
            classNames: tabsClasses,
        },
        Text: {
            defaultProps: {
                size: 'md',
            },
            styles: {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                root: (_theme: MantineTheme) => ({
                    // Font weight variants matching Text.tsx
                    '&.weight-regular': { fontWeight: '400' },
                    '&.weight-medium': { fontWeight: '500' },
                    '&.weight-semibold': { fontWeight: '600' },
                    '&.weight-bold': { fontWeight: '700' },

                    // Size variants matching Text.tsx
                    '&.display-2xl': {
                        fontSize: rem(72),
                        lineHeight: rem(90),
                    },
                    '&.display-xl': {
                        fontSize: rem(60),
                        lineHeight: rem(72),
                    },
                    '&.display-lg': {
                        fontSize: rem(48),
                        lineHeight: rem(60),
                    },
                    '&.display-md': {
                        fontSize: rem(36),
                        lineHeight: rem(44),
                    },
                    '&.display-sm': {
                        fontSize: rem(30),
                        lineHeight: rem(38),
                    },
                    '&.display-xs': {
                        fontSize: rem(24),
                        lineHeight: rem(32),
                    },
                    '&.text-xl': {
                        fontSize: rem(20),
                        lineHeight: rem(30),
                    },
                    '&.text-lg': {
                        fontSize: rem(18),
                        lineHeight: rem(28),
                    },
                    '&.text-md': {
                        fontSize: rem(16),
                        lineHeight: rem(24),
                    },
                    '&.text-sm': {
                        fontSize: rem(14),
                        lineHeight: rem(20),
                    },
                    '&.text-xs': {
                        fontSize: rem(12),
                        lineHeight: rem(18),
                    },
                }),
            },
        },
        NumberInput: {
            classNames: numberInputClasses,
            defaultProps: {
                hideControls: true,
                onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
                    if (event.key === 'Enter') {
                        event.currentTarget.blur();
                    }
                },
            },
        },
        TextInput: {
            classNames: textInputClasses,
            defaultProps: {
                onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
                    if (event.key === 'Enter') {
                        event.currentTarget.blur();
                    }
                },
            },
        },
        Textarea: {
            styles: (theme: MantineTheme) => ({
                label: {
                    marginBottom: 6,
                    '--input-label-size': 14,
                    color: theme.colors.Gray[8],
                },
                required: {
                    color: theme.colors.Brand[5],
                },
                root: {
                    width: '100%',
                },
                input: {
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: `1px solid ${theme.colors.Gray[4]}`,
                    boxShadow: '0px 1px 2px 0px rgba(10, 13, 18, 0.05)',
                    color: theme.colors.Gray[8],
                    fontSize: '16px',
                    fontWeight: 400,
                    fontFamily: theme.fontFamily,
                    resize: 'none',
                },
            }),
        },
        DatePicker: {
            defaultProps: {
                firstDayOfWeek: 0,
                allowDeselect: true,
            },
            classNames: datePickerClasses,
        },
        DateInput: {
            defaultProps: {
                firstDayOfWeek: 0,
                allowDeselect: true,
                valueFormat: getDateInputFormat(),
            },
            classNames: dateInputClasses,
        },
        TagsInput: {
            classNames: tagsInputClasses,
        },
        Dropzone: {
            classNames: dropzoneClasses,
        },
        Divider: {
            defaultProps: {
                color: colors.Gray[200],
            },
        },
        Pill: {
            classNames: pillClasses,
        },
        SegmentedControl: {
            classNames: segmentedControlClasses,
        },
        Radio: {
            classNames: radioClasses,
        },
    },
});
