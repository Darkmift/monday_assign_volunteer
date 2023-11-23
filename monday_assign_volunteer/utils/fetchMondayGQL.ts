import axios from 'axios';
import logger from './logger-winston';

const fetchGQLData = async (query: string) => {
    try {
        const response = await axios.post(
            'https://api.monday.com/v2',
            {
                query,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${process.env.MONDAY_API_KEY}`,
                    'API-Version': '2023-10',
                },
            },
        );

        return response.data;
    } catch (error) {
        logger.error(error);
        return null;
    }
};

export default fetchGQLData;
