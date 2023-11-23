import { describe, expect, test } from '@jest/globals';

import { mockVolunteers, mockHelpRequester } from '../../../mocks/entities';
import assignVolunteer from '../../../utils/assignVolunteer';

describe('assignVolunteer', () => {
    test('should assign a volunteer if language matches and capacity is below 8', () => {
        // Arrange: Set up your mock data
        const expectedVolunteerId = '1316953659'; // Replace with actual ID from your mock data

        // Act: Call assignVolunteer
        const assignedVolunteer = assignVolunteer(mockVolunteers, mockHelpRequester);

        // Assert: Check if the function returns the expected volunteer
        expect(assignedVolunteer).toBeDefined();
        expect(assignedVolunteer?.id).toBe(expectedVolunteerId);
    });

    test('should return null if no volunteers are available', () => {
        // Arrange: Set up your mock data with no available volunteers

        // Act: Call assignVolunteer
        const assignedVolunteer = assignVolunteer([], mockHelpRequester);

        // Assert: Check if the function returns null
        expect(assignedVolunteer).toBeNull();
    });

    // Add more test cases as needed
});
