import axios from 'axios';

const THINGSPEAK_CHANNEL_ID = "3272549";
const THINGSPEAK_READ_API_KEY = "27RI4WS257QIW9JY";
const MAX_RESULTS = 20;

export interface ThingSpeakFeed {
    created_at: string;
    field1: string; // PIR %
    field2: string; // TEMP C
    field3: string; // HUMIDITY %
    field4: string; // Distance cm
    field5: string; // Anomaly score
    field6: string; // Threat level
    field7: string; // Motion energy
    field8: string; // Emergency class
}

export const fetchSensorData = async (): Promise<ThingSpeakFeed[]> => {
    try {
        const response = await axios.get(
            `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}/feeds.json?api_key=${THINGSPEAK_READ_API_KEY}&results=${MAX_RESULTS}`
        );
        return response.data.feeds || [];
    } catch (error) {
        console.error("Error fetching ThingSpeak data:", error);
        return [];
    }
};
