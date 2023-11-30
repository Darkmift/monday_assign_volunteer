const getTimeForNotifyVolunteer = (): Date => {
    const now = new Date();
    const utcYear = now.getUTCFullYear();
    const utcMonth = now.getUTCMonth();
    const utcDate = now.getUTCDate();
    const utcHours = now.getUTCHours();

    // Define the two hours in 24-hour format (UTC)
    const hour1 = 7; // 07:00 UTC
    const hour2 = 15; // 15:00 UTC

    let nextHourDate: Date;

    if (utcHours < hour1) {
        nextHourDate = new Date(Date.UTC(utcYear, utcMonth, utcDate, hour1));
    } else if (utcHours < hour2) {
        nextHourDate = new Date(Date.UTC(utcYear, utcMonth, utcDate, hour2));
    } else {
        // If it's past 15:00 UTC, the next hour will be 07:00 UTC of the next day
        nextHourDate = new Date(Date.UTC(utcYear, utcMonth, utcDate + 1, hour1));
    }

    return nextHourDate;
};

export default getTimeForNotifyVolunteer;
