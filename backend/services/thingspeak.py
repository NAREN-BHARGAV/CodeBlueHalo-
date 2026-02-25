import httpx
import asyncio

THINGSPEAK_CHANNEL_ID = "3272549"
THINGSPEAK_READ_API_KEY = "27RI4WS257QIW9JY"
THINGSPEAK_URL = f"https://api.thingspeak.com/channels/{THINGSPEAK_CHANNEL_ID}/feeds.json?api_key={THINGSPEAK_READ_API_KEY}&results=10"

async def fetch_thingspeak_data():
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(THINGSPEAK_URL)
            response.raise_for_status()
            data = response.json()
            return data.get("feeds", [])
        except Exception as e:
            print(f"Error fetching ThingSpeak data: {e}")
            return []

if __name__ == "__main__":
    feeds = asyncio.run(fetch_thingspeak_data())
    print(feeds)
