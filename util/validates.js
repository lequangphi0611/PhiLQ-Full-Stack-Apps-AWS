export function isBlank(value) {
    if (value === null || value === undefined || value.trim() === '') {
        return true;
    }

    return false;
}