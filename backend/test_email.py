import httpx
import asyncio

async def run():
    async with httpx.AsyncClient() as client:
        r = await client.post('https://formsubmit.co/ajax/codyrohith007@gmail.com', json={'Message': 'test email'}, headers={'Origin': 'https://codebluehalo.ai', 'Referer': 'https://codebluehalo.ai', 'Accept': 'application/json'})
        print(r.status_code)
        print(r.text)

asyncio.run(run())
