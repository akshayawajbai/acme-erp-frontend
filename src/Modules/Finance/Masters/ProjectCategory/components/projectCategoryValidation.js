import { collectErrors, requiredText } from '../../shared/validation';

export function validateProjectCategory(form) {
    return collectErrors({
        categoryName: requiredText(form.categoryName, 'Enter the category name.'),
    });
}
