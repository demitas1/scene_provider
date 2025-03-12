import * as THREE from 'three';
import { ObjectData } from './data-interface';


export class ThreeJSApp {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private cubes: Map<string, THREE.Mesh>;
  private container: HTMLElement;

  constructor() {
    this.scene = new THREE.Scene();
    //this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // TODO: size of screen should be defined outside the ThreeJSApp
    this.camera = new THREE.PerspectiveCamera(75, 1024 / 768, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.cubes = new Map();

    // Create container div
    // TODO: container div should be defined outside the ThreeJSApp
    this.container = document.createElement('div');
    this.container.style.width = '1024px';
    this.container.style.height = '768px';
    this.container.style.position = 'absolute';
    this.container.style.top = '0';
    this.container.style.left = '0';
    document.body.appendChild(this.container);

    this.init();
  }

  private init() {
    //this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setSize(1024, 768);
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
    // TODO:
    // Fixed size, we're not changing the camera aspect or renderer size on window resize
    // but we'll keep this method to implement responsive behavior later

    //this.camera.aspect = window.innerWidth / window.innerHeight;
    //this.camera.updateProjectionMatrix();
    //this.renderer.setSize(window.innerWidth, window.innerHeight);
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