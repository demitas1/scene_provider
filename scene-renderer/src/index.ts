import * as THREE from 'three';


interface ObjectData {
    id: string;
    x: number;
    y: number;
    z: number;
    qx: number;
    qy: number;
    qz: number;
    qw: number;
}


class WebSocketClient {
    private socket: WebSocket;
    private url: string;
    private onMessage: (data: ObjectData[]) => void;
    private reconnectDelay: number = 5000;

    constructor(url: string, onMessage: (data: ObjectData[]) => void) {
        this.url = url;
        this.onMessage = onMessage;
        this.connect();
    }

    private connect() {
        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
            console.log('WebSocket connection established');
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data) as ObjectData[];
            this.onMessage(data);
        };

        this.socket.onclose = () => {
            console.log('WebSocket connection closed. Reconnecting...');
            setTimeout(() => this.connect(), this.reconnectDelay);
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.socket.close();
        };
    }
}


class ThreeJSApp {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private cubes: Map<string, THREE.Mesh>;

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.cubes = new Map();

        this.init();
    }

    private init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.camera.position.z = 15;

        // Create cubes
        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00];
        for (let i = 0; i < 4; i++) {
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshBasicMaterial({ color: colors[i] });
            const cube = new THREE.Mesh(geometry, material);
            this.scene.add(cube);
            this.cubes.set(`object${i + 1}`, cube);
        }

        window.addEventListener('resize', () => this.onWindowResize(), false);

        this.animate();
    }

    private onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }

    public updateObjects(data: ObjectData[]) {
        data.forEach(obj => {
            const cube = this.cubes.get(obj.id);
            if (cube) {
                cube.position.set(obj.x, obj.y, obj.z);
                cube.quaternion.set(obj.qx, obj.qy, obj.qz, obj.qw);
            }
        });
    }
}


// Main application
const app = new ThreeJSApp();
const wsClient = new WebSocketClient('ws://localhost:8765', (data) => app.updateObjects(data));

// Add some basic styling
const style = document.createElement('style');
style.textContent = `
    body { margin: 0; }
    canvas { display: block; }
`;
document.head.appendChild(style);
