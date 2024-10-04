import asyncio
import json
import random
import websockets
from pyquaternion import Quaternion


# Number of objects to generate data for
NUM_OBJECTS = 5


class DataProvider:
    def __init__(self):
        self.objects = [{"id": f"object{i}"} for i in range(NUM_OBJECTS)]

    def generate_data(self):
        for obj in self.objects:
            # Generate random position
            obj['x'] = random.uniform(-5, 5)
            obj['y'] = random.uniform(-5, 5)
            obj['z'] = random.uniform(-5, 5)

            # Generate random quaternion
            q = Quaternion.random()
            obj['qx'] = q.x
            obj['qy'] = q.y
            obj['qz'] = q.z
            obj['qw'] = q.w

        return self.objects


class WebSocketServer:
    def __init__(self):
        self.data_provider = DataProvider()
        self.clients = set()

    async def register(self, websocket):
        self.clients.add(websocket)
        print(f"New client connected. Total clients: {len(self.clients)}")

    async def unregister(self, websocket):
        self.clients.remove(websocket)
        print(f"Client disconnected. Total clients: {len(self.clients)}")

    async def send_data(self):
        if not self.clients:  # No clients connected
            return

        data = self.data_provider.generate_data()
        message = json.dumps(data)

        await asyncio.gather(
            *[client.send(message) for client in self.clients]
        )

    async def ws_handler(self, websocket, path):
        await self.register(websocket)
        try:
            await websocket.wait_closed()
        finally:
            await self.unregister(websocket)


async def main(host, port, interval):
    server = WebSocketServer()
    ws_server = await websockets.serve(server.ws_handler, host, port)

    print(f"WebSocket server started on ws://{host}:{port}")

    async def periodic_data_sender():
        while True:
            await server.send_data()
            await asyncio.sleep(interval)

    await asyncio.gather(
        ws_server.wait_closed(),
        periodic_data_sender()
    )


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="WebSocket server for Three.js data provider")
    parser.add_argument("--host", type=str, default="localhost", help="Host to bind the server to")
    parser.add_argument("--port", type=int, default=8765, help="Port to bind the server to")
    parser.add_argument("--interval", type=float, default=1.0, help="Interval in seconds to send data updates")

    args = parser.parse_args()

    asyncio.run(main(args.host, args.port, args.interval))
