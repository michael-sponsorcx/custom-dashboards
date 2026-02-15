import { Box, MultiSelect, MultiSelectProps, Portal } from '@mantine/core';
import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { primaryColors } from '@/stadiumDS/foundations/colors/primary';

interface StadiumMultiSelectProps extends MultiSelectProps {
    linkOption?: {
        url: string;
        label: string;
    };
    /** Maximum width for selected value pills. Set to 'none' to show full text without truncation. Default: 'none' */
    pillMaxWidth?: string;
}

const PILL_LABEL_SELECTOR = '.mantine-Pill-label';

const TOOLTIP_STYLES: React.CSSProperties = {
    position: 'fixed',
    transform: 'translate(-50%, -100%)',
    maxWidth: 300,
    padding: '6px 10px',
    color: primaryColors.Gray[900],
    fontSize: 12,
    fontWeight: 500,
    fontFamily: 'Inter',
    lineHeight: '18px',
    textAlign: 'center',
    borderRadius: 8,
    border: `1px solid ${primaryColors.Gray[200]}`,
    backgroundColor: primaryColors.Base.White,
    boxShadow:
        '0px 12px 16px -4px rgba(10, 13, 18, 0.08), 0px 4px 6px -2px rgba(10, 13, 18, 0.03), 0px 2px 2px -1px rgba(10, 13, 18, 0.04)',
    pointerEvents: 'none',
    zIndex: 1000,
};

export const StadiumMultiSelect = ({
    linkOption,
    data,
    onChange,
    styles,
    pillMaxWidth,
    ...mantineMultiSelectProps
}: StadiumMultiSelectProps) => {
    const history = useHistory();
    const [tooltip, setTooltip] = useState<{
        label: string;
        x: number;
        y: number;
    } | null>(null);

    const options = linkOption
        ? [...(data ?? []), { value: '#link', label: linkOption.label }]
        : data ?? [];

    const handleOptionChange = (newValue: string[]) => {
        if (newValue.includes('#link') && linkOption) {
            history.push(linkOption.url);
        } else {
            onChange?.(newValue);
        }
    };

    const handleMouseOver = useCallback((e: React.MouseEvent) => {
        const target = (e.target as HTMLElement).closest<HTMLElement>(
            PILL_LABEL_SELECTOR
        );
        if (target && target.scrollWidth > target.clientWidth) {
            const rect = target.getBoundingClientRect();
            setTooltip({
                label: target.textContent ?? '',
                x: rect.left + rect.width / 2,
                y: rect.top - 8,
            });
        }
    }, []);

    const handleMouseOut = useCallback((e: React.MouseEvent) => {
        const related = e.relatedTarget as HTMLElement | null;
        if (!related?.closest?.(PILL_LABEL_SELECTOR)) {
            setTooltip(null);
        }
    }, []);

    const stylesObject = typeof styles === 'object' ? styles : undefined;

    return (
        <>
            <div onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                <MultiSelect
                    {...mantineMultiSelectProps}
                    onChange={handleOptionChange}
                    styles={{
                        ...stylesObject,
                        pill: {
                            maxWidth: pillMaxWidth,
                            ...(typeof stylesObject?.pill === 'object'
                                ? stylesObject.pill
                                : {}),
                        },
                    }}
                    data={
                        options.length > 0
                            ? options
                            : [
                                  {
                                      value: 'no-items',
                                      label: 'No items found',
                                      disabled: true,
                                  },
                              ]
                    }
                />
            </div>
            {tooltip && (
                <Portal>
                    <Box
                        style={{
                            ...TOOLTIP_STYLES,
                            left: tooltip.x,
                            top: tooltip.y,
                        }}
                    >
                        {tooltip.label}
                    </Box>
                </Portal>
            )}
        </>
    );
};
