import requests
import time
import json
import argparse
from typing import List, Dict


def fetch_data(url: str) -> List[Dict]:
    """Fetch JSON data from the given URL."""
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for bad status codes
        return response.json()
    except requests.RequestException as e:
        print(f"Error fetching data: {e}")
        return []


def print_data(data: List[Dict]):
    """Print the fetched data in a formatted way."""
    print(json.dumps(data, indent=2))
    print("-" * 40)  # Separator between data sets


def main(url: str, frequency: float):
    """Main function to periodically fetch and print data."""
    print(f"Fetching data from {url} every {frequency} seconds.")
    print("Press Ctrl+C to stop.")

    try:
        while True:
            data = fetch_data(url)
            if data:
                print_data(data)
            time.sleep(frequency)
    except KeyboardInterrupt:
        print("\nStopped by user.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Fetch and print data from a JSON API periodically.")
    parser.add_argument(
        "--url",
        type=str,
        default="http://localhost:9876",
        help="URL of the data provider (default: http://localhost:9876)")
    parser.add_argument(
        "--frequency",
        type=float,
        default=1.0,
        help="Frequency of data fetching in seconds (default: 1.0)")

    args = parser.parse_args()

    main(args.url, args.frequency)
