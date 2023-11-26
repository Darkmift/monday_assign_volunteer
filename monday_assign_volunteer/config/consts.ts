export const MONDAY_API_URL = 'https://api.monday.com/v2';
export const MONDAY_API_KEY = process.env.MONDAY_API_KEY;
/**
 * This is the group id in the volunteer board that for volunteer available for assignment
 */
export const GROUP_ACTIVE_VOLUNTEERS = 'topics';
/**
 * This is the group id in the volunteer board
 * where volunteers are grouped for active assignment
 */
export const COLUMN_ASSIGN_REQUESTER_TOVOLUNTEER = 'board_relation';
/**
this is the column in the requesters board
 where the assign volunteer id is listed as board_relation
 */
export const COLUMN_ASSIGN_VOLUNTEER_TO_REQUESTER = 'connect_boards5';
/**
 * the id of the volunteers board
 */
export const VOLUNTEER_BOARD_ID = 1316808337;
/**
 * column prefix indicating its a can speak language checkbox
 */
export const CAN_SPEAK_LANG_PREFIX = 'דובר ';

/**
 * column id for capacity
 */
export const COLUMN_CAPACITY = 'numbers';
