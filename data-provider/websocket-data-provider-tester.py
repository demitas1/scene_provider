import asyncio
import websockets
import json
import argparse
from typing import List, Dict


async def receive_data(uri: str):
    """Connect to the WebSocket server and receive data."""
    try:
        async with websockets.connect(uri) as websocket:
            print(f"Connected to {uri}")
            print("Receiving data... (Press Ctrl+C to stop)")

            while True:
                data = await websocket.recv()
                print_data(json.loads(data))

    except websockets.exceptions.ConnectionClosed:
        print("Connection to the server was closed.")
    except Exception as e:
        print(f"An error occurred: {e}")


def print_data(data: List[Dict]):
    """Print the received data in a formatted way."""
    print(json.dumps(data, indent=2))
    print("-" * 40)  # Separator between data sets


async def main(uri: str):
    """Main function to run the WebSocket client."""
    try:
        await receive_data(uri)
    except KeyboardInterrupt:
        print("\nStopped by user.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="WebSocket client to test the data provider.")
    parser.add_argument(
        "--uri",
        type=str,
        default="ws://localhost:8765",
        help="WebSocket URI of the data provider (default: ws://localhost:8765)")

    args = parser.parse_args()

    asyncio.run(main(args.uri))
