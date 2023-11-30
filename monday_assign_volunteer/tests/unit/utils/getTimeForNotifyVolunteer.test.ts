// getNextHourUTC.test.ts
import { jest, describe, it, expect } from '@jest/globals';
import getNextHourUTC from '../../../utils/getTimeForNotifyVolunteer';

describe('getNextHourUTC', () => {
    it('should return 07:00 UTC if current UTC hour is before 7', () => {
        // Mock the current date to a specific time
        jest.useFakeTimers().setSystemTime(new Date(Date.UTC(2022, 5, 15, 6, 30)).getTime());

        const result = getNextHourUTC();
        expect(result.getUTCHours()).toBe(7);
        expect(result.getUTCMinutes()).toBe(0);

        jest.useRealTimers();
    });

    it('should return 15:00 UTC if current UTC hour is between 7 and 15', () => {
        jest.useFakeTimers().setSystemTime(new Date(Date.UTC(2022, 5, 15, 10, 30)).getTime());

        const result = getNextHourUTC();
        expect(result.getUTCHours()).toBe(15);
        expect(result.getUTCMinutes()).toBe(0);

        jest.useRealTimers();
    });

    it('should return 07:00 UTC of the next day if current UTC hour is after 15', () => {
        jest.useFakeTimers().setSystemTime(new Date(Date.UTC(2022, 5, 15, 16, 30)).getTime());

        const result = getNextHourUTC();
        expect(result.getUTCHours()).toBe(7);
        expect(result.getUTCMinutes()).toBe(0);
        expect(result.getUTCDate()).toBe(16); // Next day

        jest.useRealTimers();
    });
});
