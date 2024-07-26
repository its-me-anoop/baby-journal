import { format, parseISO, differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';

export const formatDate = (date, formatString = 'yyyy-MM-dd') => {
    if (typeof date === 'string') {
        date = parseISO(date);
    }
    return format(date, formatString);
};

export const calculateAge = (birthDate) => {
    const today = new Date();
    birthDate = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;

    const years = differenceInYears(today, birthDate);
    const months = differenceInMonths(today, birthDate) % 12;
    const days = differenceInDays(today, birthDate) % 30;

    return { years, months, days };
};

export const formatAge = (birthDate) => {
    const { years, months, days } = calculateAge(birthDate);
    if (years > 0) {
        return `${years} year${years > 1 ? 's' : ''} old`;
    } else if (months > 0) {
        return `${months} month${months > 1 ? 's' : ''} old`;
    } else {
        return `${days} day${days > 1 ? 's' : ''} old`;
    }
};

export const isToday = (date) => {
    return format(new Date(), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
};

export const getWeekRange = (date = new Date()) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    return {
        start: format(start, 'yyyy-MM-dd'),
        end: format(end, 'yyyy-MM-dd')
    };
};