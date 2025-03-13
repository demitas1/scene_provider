import * as THREE from 'three';
import { ObjectData } from './data-interface';

export class ThreeJSApp {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private cubes: Map<string, THREE.Mesh>;
  private container: HTMLElement | null = null;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1024 / 768, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.cubes = new Map();

    // Set renderer size to match container dimensions
    this.renderer.setSize(1024, 768);

    // Initialize after a short delay to ensure DOM is ready
    setTimeout(() => {
      this.init();
    }, 100);
  }

  private init() {
    // Get the container from the DOM (created by React)
    this.container = document.getElementById('scene-container');

    if (!this.container) {
      console.error('Could not find scene container element');
      return;
    }

    // Clear any existing content in the container
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    // Append the renderer to the container
    this.container.appendChild(this.renderer.domElement);

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

    this.animate();
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