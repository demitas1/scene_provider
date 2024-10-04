import json
import random
from http.server import BaseHTTPRequestHandler, HTTPServer
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


class RequestHandler(BaseHTTPRequestHandler):
    def __init__(self, *args, enable_cors=False, **kwargs):
        self.enable_cors = enable_cors
        self.data_provider = DataProvider()
        super().__init__(*args, **kwargs)

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')

        if self.enable_cors:
            self.send_header('Access-Control-Allow-Origin', '*')

        self.end_headers()

        data = self.data_provider.generate_data()
        self.wfile.write(json.dumps(data).encode())


def run_server(port=9876, enable_cors=False):
    server_address = ('', port)

    def handler(*args):
        RequestHandler(*args, enable_cors=enable_cors)

    httpd = HTTPServer(server_address, handler)
    print(f'Server running on port {port}')
    print(f'CORS enabled: {enable_cors}')
    httpd.serve_forever()


if __name__ == '__main__':
    # NOTE: Set to True if CORS is needed
    run_server(enable_cors=False)
