import 'styled-components/macro';
import Breadcrumb from '@/stadiumDS/applicationComponents/breadcrumbs/Breadcrumb';
import { Header } from './header';

const BreadcrumbHeader = ({
    breadCrumbList,
}: {
    breadCrumbList: { title: string; to: string }[];
}) => {
    if (breadCrumbList.length === 0) {
        return null;
    }
    return (
        <Header>
            <Breadcrumb breadCrumbList={breadCrumbList} />
        </Header>
    );
};

export default BreadcrumbHeader;
