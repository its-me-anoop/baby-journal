export const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
        return `${hours}h ${remainingMinutes}m`;
    } else {
        return `${minutes}m`;
    }
};

export const formatWeight = (weight, unit = 'kg') => {
    const formattedWeight = weight.toFixed(2);
    return `${formattedWeight} ${unit}`;
};

export const formatHeight = (height, unit = 'cm') => {
    const formattedHeight = height.toFixed(1);
    return `${formattedHeight} ${unit}`;
};

export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const formatPhoneNumber = (phoneNumber) => {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return null;
};

export const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
};