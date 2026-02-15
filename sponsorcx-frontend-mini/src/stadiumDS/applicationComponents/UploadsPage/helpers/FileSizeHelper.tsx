import { stadiumToast } from '../../Toasts/StadiumToast.helpers';

export const fileSizeHelper = (files: File[]) => {
    for (const file of files) {
        if (file.size > 2000 * 1000 * 1000) {
            stadiumToast.error('Files must be smaller than 2GB');
            return false;
        }
    }
    return true;
};
