import BreadcrumbButton from './BreadcrumbButton';
import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import 'styled-components/macro';
import Chevron from '@/stadiumDS/foundations/icons/Arrows/Chevron';
import { Fragment } from 'react';

const Breadcrumb = ({
    breadCrumbList,
}: {
    breadCrumbList: { title: string; to: string }[];
}) => {
    return (
        <div
            css={`
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 2px;
            `}
        >
            {breadCrumbList.map((item, index) => (
                <Fragment key={`${item.title}-${item.to}`}>
                    <BreadcrumbButton
                        text={item.title}
                        href={item.to}
                        current={index === breadCrumbList.length - 1}
                    />
                    {index < breadCrumbList.length - 1 && (
                        <Chevron
                            color={primaryColors.Gray[400]}
                            variant="right"
                        />
                    )}
                </Fragment>
            ))}
        </div>
    );
};

export default Breadcrumb;
