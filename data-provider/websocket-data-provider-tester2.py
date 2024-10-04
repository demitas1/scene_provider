import asyncio
import websockets
import json
import argparse
from typing import List, Dict


async def connect_and_receive(uri: str, reconnect_delay: float):
    """Connect to the WebSocket server, receive data, and handle reconnections."""
    while True:
        try:
            async with websockets.connect(uri) as websocket:
                print(f"Connected to {uri}")
                print("Receiving data... (Press Ctrl+C to stop)")

                while True:
                    try:
                        data = await websocket.recv()
                        print_data(json.loads(data))
                    except websockets.exceptions.ConnectionClosed:
                        print("Connection to the server was closed. Attempting to reconnect...")
                        break

        except (websockets.exceptions.WebSocketException, ConnectionRefusedError) as e:
            print(f"Connecting to the server... ({e})")
            await asyncio.sleep(reconnect_delay)
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            await asyncio.sleep(reconnect_delay)


def print_data(data: List[Dict]):
    """Print the received data in a formatted way."""
    print(json.dumps(data, indent=2))
    print("-" * 40)  # Separator between data sets


async def main(uri: str, reconnect_delay: float):
    """Main function to run the WebSocket client."""
    try:
        await connect_and_receive(uri, reconnect_delay)
    except KeyboardInterrupt:
        print("\nStopped by user.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Robust WebSocket client to test the data provider.")
    parser.add_argument(
        "--uri",
        type=str,
        default="ws://localhost:8765",
        help="WebSocket URI of the data provider (default: ws://localhost:8765)")
    parser.add_argument(
        "--reconnect-delay",
        type=float, default=5.0,
        help="Delay in seconds between reconnection attempts (default: 5.0)")

    args = parser.parse_args()

    asyncio.run(main(args.uri, args.reconnect_delay))
