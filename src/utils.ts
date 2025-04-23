export function formatDatetime(datetime: Date) {
    const day = String(datetime.getDate()).padStart(2, "0");
    const month = String(datetime.getMonth() + 1).padStart(2, "0");
    const year = datetime.getFullYear();

    const hours = String(datetime.getHours()).padStart(2, "0");
    const minutes = String(datetime.getMinutes()).padStart(2, "0");

    return `${day}.${month}.${year}, ${hours}:${minutes}`;
}

export function getEventStatusByDatetimes(startRegistration: Date, endRegistration: Date, start: Date, end: Date) {
    const now = new Date();
    if (now < startRegistration) {
        return "Регистрация скоро начнётся";
    } else if (now >= startRegistration && now < endRegistration) {
        return "Идёт регистрация";
    } else if (now >= endRegistration && now < start) {
        return "Регистрация завершена";
    } else if (now >= start && now < end) {
        return "Началось";
    } else {
        return "Завершено";
    }
}
