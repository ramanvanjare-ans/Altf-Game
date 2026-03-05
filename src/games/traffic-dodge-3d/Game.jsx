import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

const TrafficDodge3D = () => {
    const mountRef = useRef(null);
    const [gameState, setGameState] = useState({
        running: false,
        score: 0,
        distance: 0,
        bestScore: typeof window !== 'undefined' ? parseInt(localStorage.getItem('traffic3DBest')) || 0 : 0,
        combo: 0,
        maxCombo: 0,
        speed: 0,
        level: 1,
        showGameOver: false,
        showLevelUp: false,
    });

    const [uiState, setUiState] = useState({
        showMenu: true,
        selectedLevel: 1,
    });

    useEffect(() => {
        if (!mountRef.current || uiState.showMenu) return;

        // ============================================
        // ADVANCED PERFORMANCE CONFIGURATION
        // ============================================
        const CONFIG = {
            lanes: 4,
            laneWidth: 4,
            roadLength: 100,
            basePlayerSpeed: 0.25,
            maxPlayerSpeed: 1.0,
            baseTrafficSpeed: 0.12,
            maxTrafficSpeed: 0.4,
            laneChangeDuration: 180, // Optimized timing
            spawnInterval: 1800,
            minSpawnInterval: 800,
            levelUpScore: 1000,
            nearMissDistance: 5,
            comboDecayTime: 3000,
            maxTrafficCars: 8,

            // Advanced interpolation settings
            interpolation: {
                player: 0.25,      // Player movement smoothness
                camera: 0.08,      // Camera follow smoothness
                speed: 0.006,      // Speed change smoothness
                fov: 0.06,         // FOV transition smoothness
            },

            // Physics settings
            physics: {
                acceleration: 0.009,
                deceleration: 0.018,
                autoRegulate: 0.005,
                nitroBoost: 0.045,
                friction: 0.92,    // Speed decay factor
            },

            // Performance settings
            performance: {
                targetFPS: 60,
                adaptiveQuality: true,
                lowFPSThreshold: 45,
                highFPSThreshold: 58,
            }
        };

        const LEVELS = {
            1: { name: 'ROOKIE', color: 0x00ff00, trafficDensity: 1.0, speedMultiplier: 1.0 },
            2: { name: 'DRIVER', color: 0x00f3ff, trafficDensity: 1.15, speedMultiplier: 1.1 },
            3: { name: 'RACER', color: 0xfffc00, trafficDensity: 1.3, speedMultiplier: 1.2 },
            4: { name: 'PRO', color: 0xff6b00, trafficDensity: 1.45, speedMultiplier: 1.3 },
            5: { name: 'LEGEND', color: 0xff00ea, trafficDensity: 1.6, speedMultiplier: 1.4 },
        };

        // ============================================
        // ADVANCED INTERNAL STATE SYSTEM
        // ============================================
        let internalState = {
            running: false,
            score: 0,
            distance: 0,
            bestScore: parseInt(localStorage.getItem('traffic3DBest')) || 0,

            // Smooth speed system
            playerSpeed: CONFIG.basePlayerSpeed,
            targetPlayerSpeed: CONFIG.basePlayerSpeed,
            speedVelocity: 0, // For smooth acceleration

            currentTrafficSpeed: CONFIG.baseTrafficSpeed,
            targetTrafficSpeed: CONFIG.baseTrafficSpeed,

            combo: 0,
            maxCombo: 0,
            level: uiState.selectedLevel,
            scoreForNextLevel: CONFIG.levelUpScore,
            startTime: 0,
            lastComboTime: 0,

            // Input state
            isAccelerating: false,
            isBraking: false,
            nitroActive: false,
            nitroCharge: 100,

            // Performance monitoring
            frameCount: 0,
            lastFPSCheck: 0,
            currentFPS: 60,
            qualityLevel: 1, // 0: low, 1: medium, 2: high
        };

        // ============================================
        // INPUT BUFFER SYSTEM (For responsive controls)
        // ============================================
        const inputBuffer = {
            queue: [],
            maxSize: 3,
            processingDelay: 50, // ms

            add(input) {
                this.queue.push({ input, timestamp: Date.now() });
                if (this.queue.length > this.maxSize) {
                    this.queue.shift();
                }
            },

            process() {
                const now = Date.now();
                this.queue = this.queue.filter(item => now - item.timestamp < 500);
                return this.queue.length > 0 ? this.queue[0].input : null;
            },

            clear() {
                this.queue = [];
            }
        };

        // ============================================
        // SMOOTH INTERPOLATION UTILITIES
        // ============================================
        const Interpolation = {
            // Smooth damping (critically damped spring)
            smoothDamp(current, target, velocity, smoothTime, deltaTime) {
                smoothTime = Math.max(0.0001, smoothTime);
                const omega = 2 / smoothTime;
                const x = omega * deltaTime;
                const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);

                let change = current - target;
                const originalTo = target;
                const maxChange = Infinity;

                change = Math.max(-maxChange, Math.min(change, maxChange));
                target = current - change;

                const temp = (velocity + omega * change) * deltaTime;
                velocity = (velocity - omega * temp) * exp;
                let output = target + (change + temp) * exp;

                if (originalTo - current > 0 === output > originalTo) {
                    output = originalTo;
                    velocity = (output - originalTo) / deltaTime;
                }

                return { value: output, velocity };
            },

            // Ease out cubic
            easeOutCubic(t) {
                return 1 - Math.pow(1 - t, 3);
            },

            // Ease in-out cubic
            easeInOutCubic(t) {
                return t < 0.5
                    ? 4 * t * t * t
                    : 1 - Math.pow(-2 * t + 2, 3) / 2;
            },

            // Smooth step
            smoothStep(t) {
                return t * t * (3 - 2 * t);
            },

            // Lerp with delta time compensation
            lerp(a, b, t, deltaTime) {
                const factor = 1 - Math.pow(1 - t, deltaTime * 60);
                return a + (b - a) * factor;
            }
        };

        // ============================================
        // THREE.JS SETUP WITH ADAPTIVE QUALITY
        // ============================================
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a1a);
        scene.fog = new THREE.Fog(0x0a0a1a, 40, 100);

        const camera = new THREE.PerspectiveCamera(
            70,
            mountRef.current.clientWidth / mountRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.set(0, 10, 18);
        camera.lookAt(0, 0, 0);

        // Adaptive renderer configuration
        const getRendererConfig = (qualityLevel) => ({
            antialias: qualityLevel > 0,
            alpha: false,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
        });

        const renderer = new THREE.WebGLRenderer(getRendererConfig(internalState.qualityLevel));
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, internalState.qualityLevel === 2 ? 2 : 1.5));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        mountRef.current.appendChild(renderer.domElement);

        // ============================================
        // OPTIMIZED LIGHTING SYSTEM
        // ============================================
        const ambientLight = new THREE.AmbientLight(0x404070, 0.6);
        scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
        mainLight.position.set(10, 20, 10);
        mainLight.castShadow = true;
        mainLight.shadow.camera.left = -30;
        mainLight.shadow.camera.right = 30;
        mainLight.shadow.camera.top = 30;
        mainLight.shadow.camera.bottom = -30;
        mainLight.shadow.mapSize.width = 1024;
        mainLight.shadow.mapSize.height = 1024;
        mainLight.shadow.bias = -0.0001;
        scene.add(mainLight);

        const hemiLight = new THREE.HemisphereLight(0x0000ff, 0xff00ff, 0.25);
        scene.add(hemiLight);

        // ============================================
        // OPTIMIZED STREET LIGHTS WITH POOLING
        // ============================================
        const neonColors = [0x00f3ff, 0xff00ea, 0xfffc00, 0xff006a, 0x00ff00, 0xff3366];
        const streetLights = [];

        // Shared geometries and materials for lights
        const lightGeometries = {
            pole: new THREE.CylinderGeometry(0.2, 0.25, 8, 8),
            bulb: new THREE.SphereGeometry(0.5, 12, 12),
        };

        for (let i = 0; i < 8; i++) {
            const color = neonColors[i % neonColors.length];
            const side = i % 2 === 0 ? -1 : 1;

            const light = new THREE.PointLight(color, 3, 40);
            light.position.set(side * 14, 8, -40 + i * 10);
            scene.add(light);
            streetLights.push({
                light,
                baseIntensity: 3,
                phase: i * 0.5,
                targetIntensity: 3,
                currentIntensity: 3
            });

            // Light pole with shared geometry
            const poleGroup = new THREE.Group();
            const poleMaterial = new THREE.MeshStandardMaterial({
                color: 0x1a1a1a,
                metalness: 0.8,
                roughness: 0.3
            });
            const pole = new THREE.Mesh(lightGeometries.pole, poleMaterial);
            pole.castShadow = true;
            poleGroup.add(pole);

            const bulbMaterial = new THREE.MeshStandardMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 2.5,
                transparent: true,
                opacity: 0.85
            });
            const bulb = new THREE.Mesh(lightGeometries.bulb, bulbMaterial);
            bulb.position.y = 4;
            poleGroup.add(bulb);

            poleGroup.position.set(side * 14, 4, -40 + i * 10);
            scene.add(poleGroup);
        }

        // ============================================
        // OPTIMIZED PARTICLE SYSTEM
        // ============================================
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 300;
        const posArray = new Float32Array(particlesCount * 3);
        const velocityArray = new Float32Array(particlesCount); // For varied speeds

        for (let i = 0; i < particlesCount; i++) {
            const i3 = i * 3;
            posArray[i3] = (Math.random() - 0.5) * 80;
            posArray[i3 + 1] = Math.random() * 30;
            posArray[i3 + 2] = (Math.random() - 0.5) * 80;
            velocityArray[i] = 0.5 + Math.random() * 0.5; // Random velocity multiplier
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.12,
            color: 0x00f3ff,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // ============================================
        // ROAD SYSTEM WITH OPTIMIZED MATERIALS
        // ============================================
        const roadGroup = new THREE.Group();
        scene.add(roadGroup);

        // Shared materials
        const roadMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a2e,
            roughness: 0.85,
            metalness: 0.15
        });

        const roadGeometry = new THREE.PlaneGeometry(CONFIG.lanes * CONFIG.laneWidth, CONFIG.roadLength);
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.rotation.x = -Math.PI / 2;
        road.receiveShadow = true;
        roadGroup.add(road);

        // Lane markings with instancing for performance
        const laneMarkings = [];
        const markingGeometry = new THREE.BoxGeometry(0.3, 0.08, 2.5);
        const markingMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 1.0
        });

        for (let lane = 1; lane < CONFIG.lanes; lane++) {
            for (let z = -CONFIG.roadLength / 2; z < CONFIG.roadLength / 2; z += 8) {
                const marking = new THREE.Mesh(markingGeometry, markingMaterial);
                marking.position.set(
                    (lane * CONFIG.laneWidth) - (CONFIG.lanes * CONFIG.laneWidth / 2),
                    0.05,
                    z
                );
                roadGroup.add(marking);
                laneMarkings.push(marking);
            }
        }

        // Road barriers
        const barrierGeometry = new THREE.BoxGeometry(0.8, 1.2, CONFIG.roadLength);

        const leftBarrierMaterial = new THREE.MeshStandardMaterial({
            color: 0x00f3ff,
            emissive: 0x00f3ff,
            emissiveIntensity: 1.5,
            metalness: 0.85,
            roughness: 0.2
        });
        const leftBarrier = new THREE.Mesh(barrierGeometry, leftBarrierMaterial);
        leftBarrier.position.set(-CONFIG.lanes * CONFIG.laneWidth / 2 - 1.2, 0.6, 0);
        leftBarrier.castShadow = true;
        roadGroup.add(leftBarrier);

        const rightBarrierMaterial = new THREE.MeshStandardMaterial({
            color: 0xff00ea,
            emissive: 0xff00ea,
            emissiveIntensity: 1.5,
            metalness: 0.85,
            roughness: 0.2
        });
        const rightBarrier = new THREE.Mesh(barrierGeometry, rightBarrierMaterial);
        rightBarrier.position.set(CONFIG.lanes * CONFIG.laneWidth / 2 + 1.2, 0.6, 0);
        rightBarrier.castShadow = true;
        roadGroup.add(rightBarrier);

        // Optimized buildings
        const buildingGeometry = new THREE.BoxGeometry(4, 1, 4); // Base height, will be scaled
        for (let i = 0; i < 12; i++) {
            const height = 12 + Math.random() * 20;
            const buildingMaterial = new THREE.MeshStandardMaterial({
                color: 0x1a1a2a,
                emissive: neonColors[i % neonColors.length],
                emissiveIntensity: 0.25
            });
            const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
            building.scale.y = height;

            const side = i % 2 === 0 ? -1 : 1;
            building.position.set(
                side * (18 + Math.random() * 8),
                height / 2,
                -35 + (i % 6) * 12
            );
            scene.add(building);
        }

        // ============================================
        // ADVANCED CAR CREATION WITH GEOMETRY CACHING
        // ============================================
        const carGeometryCache = {
            body: new THREE.BoxGeometry(2.2, 1, 4.5),
            hood: new THREE.BoxGeometry(2.1, 0.25, 1.3),
            cabin: new THREE.BoxGeometry(2, 1, 2.4),
            roof: new THREE.BoxGeometry(1.9, 0.12, 2.3),
            windshield: new THREE.BoxGeometry(1.9, 0.9, 0.15),
            sideWindow: new THREE.BoxGeometry(0.15, 0.8, 2),
            tire: new THREE.CylinderGeometry(0.5, 0.5, 0.4, 16),
            rim: new THREE.CylinderGeometry(0.28, 0.28, 0.45, 6),
            cap: new THREE.CylinderGeometry(0.12, 0.12, 0.47, 12),
            bumper: new THREE.BoxGeometry(2.3, 0.35, 0.5),
            headlight: new THREE.BoxGeometry(0.5, 0.3, 0.18),
            taillight: new THREE.BoxGeometry(0.4, 0.28, 0.14),
            mirror: new THREE.BoxGeometry(0.22, 0.16, 0.3),
            grille: new THREE.BoxGeometry(1.5, 0.45, 0.14),
            exhaust: new THREE.CylinderGeometry(0.11, 0.13, 0.35, 12),
        };

        // Material cache
        const materialCache = new Map();

        function getMaterial(type, color) {
            const key = `${type}-${color}`;
            if (!materialCache.has(key)) {
                let material;
                switch (type) {
                    case 'body':
                        material = new THREE.MeshStandardMaterial({
                            color: color,
                            metalness: 0.5, // Reduced metalness for better visibility
                            roughness: 0.3, // Increased roughness
                            emissive: color, // Add emissive to make it glow slightly
                            emissiveIntensity: 0.2
                        });
                        break;
                    case 'glass':
                        material = new THREE.MeshStandardMaterial({
                            color: 0x111122,
                            metalness: 0.95,
                            roughness: 0.05,
                            transparent: true,
                            opacity: 0.35
                        });
                        break;
                    case 'tire':
                        material = new THREE.MeshStandardMaterial({
                            color: 0x0a0a0a,
                            roughness: 0.9,
                            metalness: 0.1
                        });
                        break;
                    case 'chrome':
                        material = new THREE.MeshStandardMaterial({
                            color: 0xcccccc,
                            metalness: 0.9,
                            roughness: 0.1
                        });
                        break;
                }
                materialCache.set(key, material);
            }
            return materialCache.get(key);
        }

        function createOptimizedCar(color, isPlayer = false) {
            const car = new THREE.Group();
            const bodyMaterial = getMaterial('body', color);
            const glassMaterial = getMaterial('glass', 0x111122);
            const tireMaterial = getMaterial('tire', 0x0a0a0a);
            const chromeMaterial = getMaterial('chrome', 0xcccccc);

            // Main body
            const body = new THREE.Mesh(carGeometryCache.body, bodyMaterial);
            body.position.y = 0.6;
            body.castShadow = true;
            car.add(body);

            // Hood
            const hood = new THREE.Mesh(carGeometryCache.hood, bodyMaterial);
            hood.position.set(0, 1.05, 1.5);
            hood.rotation.x = -0.15;
            hood.castShadow = true;
            car.add(hood);

            // Cabin
            const cabin = new THREE.Mesh(carGeometryCache.cabin, bodyMaterial);
            cabin.position.set(0, 1.5, -0.4);
            cabin.castShadow = true;
            car.add(cabin);

            // Roof
            const roof = new THREE.Mesh(carGeometryCache.roof, bodyMaterial);
            roof.position.set(0, 2, -0.4);
            car.add(roof);

            // Windows
            const frontWindshield = new THREE.Mesh(carGeometryCache.windshield, glassMaterial);
            frontWindshield.position.set(0, 1.5, 0.85);
            frontWindshield.rotation.x = -0.25;
            car.add(frontWindshield);

            const rearWindshield = new THREE.Mesh(carGeometryCache.windshield, glassMaterial);
            rearWindshield.position.set(0, 1.5, -1.65);
            rearWindshield.rotation.x = 0.25;
            car.add(rearWindshield);

            const leftWindow = new THREE.Mesh(carGeometryCache.sideWindow, glassMaterial);
            leftWindow.position.set(1, 1.4, -0.4);
            car.add(leftWindow);

            const rightWindow = new THREE.Mesh(carGeometryCache.sideWindow, glassMaterial);
            rightWindow.position.set(-1, 1.4, -0.4);
            car.add(rightWindow);

            // Wheels
            const wheelPositions = [
                { x: -1.2, y: 0.5, z: 1.7 },
                { x: 1.2, y: 0.5, z: 1.7 },
                { x: -1.2, y: 0.5, z: -1.7 },
                { x: 1.2, y: 0.5, z: -1.7 }
            ];

            const capMaterial = getMaterial('body', color);

            wheelPositions.forEach(pos => {
                const wheelGroup = new THREE.Group();

                const tire = new THREE.Mesh(carGeometryCache.tire, tireMaterial);
                tire.rotation.z = Math.PI / 2;
                tire.castShadow = true;
                wheelGroup.add(tire);

                const rim = new THREE.Mesh(carGeometryCache.rim, chromeMaterial);
                rim.rotation.z = Math.PI / 2;
                wheelGroup.add(rim);

                const cap = new THREE.Mesh(carGeometryCache.cap, capMaterial);
                cap.rotation.z = Math.PI / 2;
                wheelGroup.add(cap);

                wheelGroup.position.set(pos.x, pos.y, pos.z);
                car.add(wheelGroup);
            });

            // Bumpers
            const bumperMaterial = new THREE.MeshStandardMaterial({
                color: 0x1a1a1a,
                metalness: 0.75,
                roughness: 0.25
            });

            const frontBumper = new THREE.Mesh(carGeometryCache.bumper, bumperMaterial);
            frontBumper.position.set(0, 0.4, 2.5);
            frontBumper.castShadow = true;
            car.add(frontBumper);

            const rearBumper = new THREE.Mesh(carGeometryCache.bumper, bumperMaterial);
            rearBumper.position.set(0, 0.4, -2.5);
            rearBumper.castShadow = true;
            car.add(rearBumper);

            // Lights
            if (isPlayer) {
                const headlightMaterial = new THREE.MeshStandardMaterial({
                    color: 0xffffff,
                    emissive: 0xfffc00,
                    emissiveIntensity: 3.5
                });

                const leftHeadlight = new THREE.Mesh(carGeometryCache.headlight, headlightMaterial);
                leftHeadlight.position.set(-0.75, 0.65, 2.3);
                car.add(leftHeadlight);

                const rightHeadlight = new THREE.Mesh(carGeometryCache.headlight, headlightMaterial);
                rightHeadlight.position.set(0.75, 0.65, 2.3);
                car.add(rightHeadlight);

                const spotLight1 = new THREE.SpotLight(0xfffc00, 4, 40, Math.PI / 7, 0.3);
                spotLight1.position.set(-0.75, 0.65, 2.3);
                spotLight1.target.position.set(-0.75, 0, -25);
                car.add(spotLight1);
                car.add(spotLight1.target);

                const spotLight2 = new THREE.SpotLight(0xfffc00, 4, 40, Math.PI / 7, 0.3);
                spotLight2.position.set(0.75, 0.65, 2.3);
                spotLight2.target.position.set(0.75, 0, -25);
                car.add(spotLight2);
                car.add(spotLight2.target);

                const underglowLight = new THREE.PointLight(0x00f3ff, 2.5, 10);
                underglowLight.position.set(0, 0.2, 0);
                car.add(underglowLight);

            } else {
                const taillightMaterial = new THREE.MeshStandardMaterial({
                    color: 0xff0000,
                    emissive: 0xff0000,
                    emissiveIntensity: 2.5
                });

                const leftTaillight = new THREE.Mesh(carGeometryCache.taillight, taillightMaterial);
                leftTaillight.position.set(-0.75, 0.65, -2.3);
                car.add(leftTaillight);

                const rightTaillight = new THREE.Mesh(carGeometryCache.taillight, taillightMaterial);
                rightTaillight.position.set(0.75, 0.65, -2.3);
                car.add(rightTaillight);
            }

            // Mirrors
            const mirrorMaterial = new THREE.MeshStandardMaterial({
                color: 0x2a2a2a,
                metalness: 0.85,
                roughness: 0.15
            });

            const leftMirror = new THREE.Mesh(carGeometryCache.mirror, mirrorMaterial);
            leftMirror.position.set(-1.15, 1.3, 0.6);
            car.add(leftMirror);

            const rightMirror = new THREE.Mesh(carGeometryCache.mirror, mirrorMaterial);
            rightMirror.position.set(1.15, 1.3, 0.6);
            car.add(rightMirror);

            // Grille
            const grilleMaterial = new THREE.MeshStandardMaterial({
                color: 0x0a0a0a,
                metalness: 0.6,
                roughness: 0.4
            });
            const grille = new THREE.Mesh(carGeometryCache.grille, grilleMaterial);
            grille.position.set(0, 0.55, 2.35);
            car.add(grille);

            // Exhaust
            const exhaustMaterial = new THREE.MeshStandardMaterial({
                color: 0x2a2a2a,
                metalness: 0.9,
                roughness: 0.15
            });

            [-0.7, 0.7].forEach(x => {
                const exhaust = new THREE.Mesh(carGeometryCache.exhaust, exhaustMaterial);
                exhaust.rotation.x = Math.PI / 2;
                exhaust.position.set(x, 0.35, -2.4);
                car.add(exhaust);
            });

            return car;
        }

        // ============================================
        // ADVANCED PLAYER SYSTEM WITH SMOOTH LANE CHANGES
        // ============================================
        const player = {
            lane: Math.floor(CONFIG.lanes / 2),
            car: createOptimizedCar(LEVELS[uiState.selectedLevel].color, true),
            targetLane: Math.floor(CONFIG.lanes / 2),

            // Smooth position tracking
            currentX: 0,
            targetX: 0,
            velocityX: 0,

            // Lane change state
            isChangingLane: false,
            changeLaneStartTime: 0,
            changeLaneProgress: 0,
            lastLaneChange: 0,

            // Tilt animation
            currentTilt: 0,
            targetTilt: 0,
        };

        // Initialize player position
        const startX = (player.lane - CONFIG.lanes / 2 + 0.5) * CONFIG.laneWidth;
        player.currentX = startX;
        player.targetX = startX;
        player.car.position.set(startX, 0, 12);
        scene.add(player.car);

        // ============================================
        // TRAFFIC MANAGEMENT WITH OBJECT POOLING
        // ============================================
        const traffic = [];
        const trafficPool = [];

        function createTrafficCar(lane) {
            let car;

            if (trafficPool.length > 0) {
                car = trafficPool.pop();
                car.visible = true;
            } else {
                // High contrast colors for better visibility
                const colors = [
                    0xffffff, // White
                    0xff3333, // Bright Red
                    0xffaa00, // Bright Orange
                    0x3388ff, // Bright Blue
                    0x00ffaa, // Teal
                    0xffd700, // Gold
                    0xcccccc, // Silver
                    0xff5555  // Salmon
                ];
                const color = colors[Math.floor(Math.random() * colors.length)];
                car = createOptimizedCar(color, false);
            }

            const vehicle = {
                car: car,
                lane: lane,
                speed: internalState.currentTrafficSpeed,
                passed: false,
                checkedNearMiss: false,
                // Smooth movement
                smoothZ: -CONFIG.roadLength / 2 - 10,
                velocityZ: 0
            };

            car.position.set(
                (lane - CONFIG.lanes / 2 + 0.5) * CONFIG.laneWidth,
                0,
                vehicle.smoothZ
            );
            scene.add(car);

            return vehicle;
        }

        // Spawn logic
        let lastSpawnTime = 0;

        function spawnTraffic() {
            const now = Date.now();

            if (traffic.length >= CONFIG.maxTrafficCars) return;

            const levelConfig = LEVELS[internalState.level];
            const adjustedInterval = CONFIG.spawnInterval / levelConfig.trafficDensity;

            if (now - lastSpawnTime < adjustedInterval) return;
            if (now - internalState.startTime < 2000) return;

            // Smart lane blocking detection
            const blockedLanes = new Set();
            traffic.forEach(vehicle => {
                if (vehicle.car.position.z < -15 && vehicle.car.position.z > -35) {
                    blockedLanes.add(vehicle.lane);
                }
            });

            const availableLanes = [];
            for (let i = 0; i < CONFIG.lanes; i++) {
                if (!blockedLanes.has(i)) {
                    availableLanes.push(i);
                }
            }

            if (availableLanes.length > 0 && blockedLanes.size < CONFIG.lanes - 1) {
                const lane = availableLanes[Math.floor(Math.random() * availableLanes.length)];
                traffic.push(createTrafficCar(lane));
                lastSpawnTime = now;
            }
        }

        // ============================================
        // ADVANCED INPUT HANDLING WITH BUFFERING
        // ============================================
        const keys = {};

        function changeLane(direction) {
            const now = Date.now();

            // Allow lane change queueing if already changing
            if (player.isChangingLane) {
                if (now - player.changeLaneStartTime > CONFIG.laneChangeDuration * 0.6) {
                    // Can start next lane change in last 40% of current change
                    const newLane = player.targetLane + direction;
                    if (newLane >= 0 && newLane < CONFIG.lanes && newLane !== player.targetLane) {
                        inputBuffer.add({ type: 'laneChange', direction });
                    }
                }
                return;
            }

            if (now - player.lastLaneChange < 50) return; // Minimum delay between changes

            const newLane = player.lane + direction;
            if (newLane >= 0 && newLane < CONFIG.lanes) {
                player.targetLane = newLane;
                player.isChangingLane = true;
                player.changeLaneStartTime = now;
                player.changeLaneProgress = 0;
                player.lastLaneChange = now;

                // Set target position
                player.targetX = (newLane - CONFIG.lanes / 2 + 0.5) * CONFIG.laneWidth;
                player.targetTilt = direction * -0.15;
            }
        }

        function handleKeyDown(e) {
            if (!internalState.running) return;
            if (keys[e.key]) return;
            keys[e.key] = true;

            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                changeLane(-1);
            } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                changeLane(1);
            } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                internalState.isAccelerating = true;
            } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                internalState.isBraking = true;
            } else if (e.key === ' ' || e.key === 'Shift') {
                if (internalState.nitroCharge > 20 && !internalState.nitroActive) {
                    internalState.nitroActive = true;
                }
            }
        }

        function handleKeyUp(e) {
            keys[e.key] = false;

            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                internalState.isAccelerating = false;
            } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                internalState.isBraking = false;
            } else if (e.key === ' ' || e.key === 'Shift') {
                internalState.nitroActive = false;
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        // ============================================
        // ULTRA-SMOOTH UPDATE FUNCTIONS
        // ============================================

        function updatePlayer(deltaTime) {
            const levelConfig = LEVELS[internalState.level];
            const maxSpeed = CONFIG.maxPlayerSpeed * levelConfig.speedMultiplier;

            // Smooth speed control with physics
            if (internalState.isAccelerating) {
                internalState.targetPlayerSpeed = Math.min(maxSpeed,
                    internalState.targetPlayerSpeed + CONFIG.physics.acceleration);
            } else if (internalState.isBraking) {
                internalState.targetPlayerSpeed = Math.max(CONFIG.basePlayerSpeed * 0.3,
                    internalState.targetPlayerSpeed - CONFIG.physics.deceleration);
            } else {
                // Auto-regulate to base speed
                if (internalState.targetPlayerSpeed > CONFIG.basePlayerSpeed) {
                    internalState.targetPlayerSpeed -= CONFIG.physics.autoRegulate;
                } else if (internalState.targetPlayerSpeed < CONFIG.basePlayerSpeed) {
                    internalState.targetPlayerSpeed += CONFIG.physics.autoRegulate;
                }
            }

            // Nitro boost
            if (internalState.nitroActive && internalState.nitroCharge > 0) {
                internalState.targetPlayerSpeed = Math.min(maxSpeed * 1.4,
                    internalState.targetPlayerSpeed + CONFIG.physics.nitroBoost);
                internalState.nitroCharge -= 0.4;
            } else {
                internalState.nitroActive = false;
                if (internalState.nitroCharge < 100) {
                    internalState.nitroCharge += 0.08;
                }
            }

            // Smooth speed interpolation using damping
            const speedDamp = Interpolation.smoothDamp(
                internalState.playerSpeed,
                internalState.targetPlayerSpeed,
                internalState.speedVelocity,
                0.15,
                deltaTime
            );
            internalState.playerSpeed = speedDamp.value;
            internalState.speedVelocity = speedDamp.velocity;

            // Ultra-smooth lane changing with advanced easing
            if (player.isChangingLane) {
                const now = Date.now();
                const elapsed = now - player.changeLaneStartTime;
                player.changeLaneProgress = Math.min(elapsed / CONFIG.laneChangeDuration, 1);

                // Custom easing for smoother lane change
                const eased = Interpolation.easeInOutCubic(player.changeLaneProgress);

                // Smooth X position using damping
                const targetXInterpolated = player.currentX + (player.targetX - player.currentX) * eased;
                const xDamp = Interpolation.smoothDamp(
                    player.car.position.x,
                    targetXInterpolated,
                    player.velocityX,
                    0.08,
                    deltaTime
                );
                player.car.position.x = xDamp.value;
                player.velocityX = xDamp.velocity;

                // Smooth tilt animation
                const tiltEased = Math.sin(player.changeLaneProgress * Math.PI);
                player.currentTilt = player.targetTilt * tiltEased;
                player.car.rotation.z = player.currentTilt;

                if (player.changeLaneProgress >= 1) {
                    player.lane = player.targetLane;
                    player.isChangingLane = false;
                    player.currentX = player.targetX;
                    player.car.rotation.z = 0;
                    player.currentTilt = 0;
                    player.targetTilt = 0;
                    player.velocityX = 0;

                    // Process buffered input
                    const bufferedInput = inputBuffer.process();
                    if (bufferedInput && bufferedInput.type === 'laneChange') {
                        inputBuffer.clear();
                        setTimeout(() => changeLane(bufferedInput.direction), 10);
                    }
                }
            } else {
                // Ensure smooth return to center if not changing lanes
                const centerDamp = Interpolation.smoothDamp(
                    player.car.position.x,
                    player.targetX,
                    player.velocityX,
                    0.1,
                    deltaTime
                );
                player.car.position.x = centerDamp.value;
                player.velocityX = centerDamp.velocity;
            }

            // Smooth FOV changes
            const speedFactor = internalState.playerSpeed / maxSpeed;
            const targetFOV = 70 + speedFactor * 10;
            camera.fov = Interpolation.lerp(camera.fov, targetFOV, CONFIG.interpolation.fov, deltaTime);
            camera.updateProjectionMatrix();
        }

        function updateTraffic(deltaTime) {
            const relativeSpeed = internalState.currentTrafficSpeed + internalState.playerSpeed;

            for (let i = traffic.length - 1; i >= 0; i--) {
                const vehicle = traffic[i];

                // Smooth traffic movement
                vehicle.smoothZ += relativeSpeed;
                vehicle.car.position.z = vehicle.smoothZ;

                // Optimized collision detection with early exit
                const dx = Math.abs(vehicle.car.position.x - player.car.position.x);
                if (dx < 3) { // Only check Z if X is close
                    const dz = Math.abs(vehicle.car.position.z - player.car.position.z);
                    if (dz < 5.5) {
                        handleGameOver();
                        return;
                    }
                }

                // Near miss detection
                if (!vehicle.checkedNearMiss && vehicle.car.position.z > player.car.position.z - 2) {
                    if (dx < CONFIG.nearMissDistance && dx > 2.5) {
                        vehicle.checkedNearMiss = true;
                        internalState.combo++;
                        internalState.lastComboTime = Date.now();
                        if (internalState.combo > internalState.maxCombo) {
                            internalState.maxCombo = internalState.combo;
                        }
                    }
                }

                // Remove and pool off-screen vehicles
                if (vehicle.car.position.z > 35) {
                    scene.remove(vehicle.car);
                    vehicle.car.visible = false;
                    trafficPool.push(vehicle.car);
                    traffic.splice(i, 1);
                }
            }
        }

        function updateRoad(deltaTime) {
            const scrollSpeed = internalState.currentTrafficSpeed + internalState.playerSpeed;

            // Smooth lane marking scroll
            laneMarkings.forEach(marking => {
                marking.position.z += scrollSpeed;
                if (marking.position.z > CONFIG.roadLength / 2) {
                    marking.position.z -= CONFIG.roadLength;
                }
            });

            // Smooth particle movement with varied speeds
            const positions = particlesGeometry.attributes.position.array;
            for (let i = 0; i < particlesCount; i++) {
                const i3 = i * 3;
                positions[i3 + 2] += scrollSpeed * 1.8 * velocityArray[i];
                if (positions[i3 + 2] > 40) {
                    positions[i3 + 2] = -40;
                    positions[i3] = (Math.random() - 0.5) * 80;
                    positions[i3 + 1] = Math.random() * 30;
                }
            }
            particlesGeometry.attributes.position.needsUpdate = true;
        }

        function updateDifficulty() {
            const elapsed = Date.now() - internalState.startTime;
            const levelConfig = LEVELS[internalState.level];

            // Smooth traffic speed increase
            internalState.targetTrafficSpeed = Math.min(
                CONFIG.maxTrafficSpeed,
                CONFIG.baseTrafficSpeed * levelConfig.speedMultiplier + Math.floor(elapsed / 12000) * 0.008
            );

            // Smooth interpolation to target speed
            internalState.currentTrafficSpeed = Interpolation.lerp(
                internalState.currentTrafficSpeed,
                internalState.targetTrafficSpeed,
                0.01,
                1
            );
        }

        function checkLevelUp() {
            if (internalState.score >= internalState.scoreForNextLevel && internalState.level < 5) {
                internalState.level++;
                internalState.scoreForNextLevel += CONFIG.levelUpScore;

                setGameState(prev => ({
                    ...prev,
                    level: internalState.level,
                    showLevelUp: true
                }));

                setTimeout(() => {
                    setGameState(prev => ({ ...prev, showLevelUp: false }));
                }, 2000);
            }
        }

        function updateCombo() {
            const now = Date.now();
            if (now - internalState.lastComboTime > CONFIG.comboDecayTime) {
                internalState.combo = 0;
            }
        }

        // Performance monitoring and adaptive quality
        function monitorPerformance() {
            internalState.frameCount++;
            const now = Date.now();

            if (now - internalState.lastFPSCheck > 1000) {
                internalState.currentFPS = internalState.frameCount;
                internalState.frameCount = 0;
                internalState.lastFPSCheck = now;

                // Adaptive quality adjustment
                if (CONFIG.performance.adaptiveQuality) {
                    if (internalState.currentFPS < CONFIG.performance.lowFPSThreshold && internalState.qualityLevel > 0) {
                        internalState.qualityLevel--;
                        adjustQuality(internalState.qualityLevel);
                    } else if (internalState.currentFPS > CONFIG.performance.highFPSThreshold && internalState.qualityLevel < 2) {
                        internalState.qualityLevel++;
                        adjustQuality(internalState.qualityLevel);
                    }
                }
            }
        }

        function adjustQuality(level) {
            // Adjust renderer quality
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, level === 2 ? 2 : (level === 1 ? 1.5 : 1)));

            // Adjust shadow quality
            mainLight.shadow.mapSize.width = level === 2 ? 2048 : (level === 1 ? 1024 : 512);
            mainLight.shadow.mapSize.height = mainLight.shadow.mapSize.width;
            mainLight.shadow.map?.dispose();
            mainLight.shadow.map = null;
        }

        // Throttled UI updates
        let lastUIUpdate = 0;
        const UI_UPDATE_INTERVAL = 100;

        function updateGameState() {
            const now = Date.now();

            if (now - lastUIUpdate < UI_UPDATE_INTERVAL) return;
            lastUIUpdate = now;

            const comboBonus = internalState.combo * 10;
            const speedBonus = Math.floor(internalState.playerSpeed * 50);

            internalState.score = Math.floor((now - internalState.startTime) / 100) + comboBonus + speedBonus;
            internalState.distance = Math.floor((now - internalState.startTime) / 1000 * internalState.playerSpeed * 100);

            setGameState(prev => ({
                ...prev,
                running: true,
                score: internalState.score,
                distance: internalState.distance,
                combo: internalState.combo,
                speed: Math.floor(internalState.playerSpeed * 200),
                level: internalState.level,
            }));
        }

        function handleGameOver() {
            internalState.running = false;

            if (internalState.score > internalState.bestScore) {
                internalState.bestScore = internalState.score;
                localStorage.setItem('traffic3DBest', internalState.bestScore);
            }

            setGameState(prev => ({
                ...prev,
                running: false,
                showGameOver: true,
                bestScore: internalState.bestScore,
                maxCombo: internalState.maxCombo,
            }));
        }

        function startGame() {
            internalState.running = true;
            internalState.score = 0;
            internalState.distance = 0;
            internalState.combo = 0;
            internalState.maxCombo = 0;
            internalState.playerSpeed = CONFIG.basePlayerSpeed;
            internalState.targetPlayerSpeed = CONFIG.basePlayerSpeed;
            internalState.speedVelocity = 0;
            internalState.currentTrafficSpeed = CONFIG.baseTrafficSpeed;
            internalState.targetTrafficSpeed = CONFIG.baseTrafficSpeed;
            internalState.level = uiState.selectedLevel;
            internalState.scoreForNextLevel = CONFIG.levelUpScore;
            internalState.startTime = Date.now();
            internalState.lastComboTime = Date.now();
            internalState.isAccelerating = false;
            internalState.isBraking = false;
            internalState.nitroActive = false;
            internalState.nitroCharge = 100;
            internalState.frameCount = 0;
            internalState.lastFPSCheck = Date.now();

            player.lane = Math.floor(CONFIG.lanes / 2);
            player.targetLane = player.lane;
            player.isChangingLane = false;
            player.changeLaneProgress = 0;

            const startX = (player.lane - CONFIG.lanes / 2 + 0.5) * CONFIG.laneWidth;
            player.currentX = startX;
            player.targetX = startX;
            player.velocityX = 0;
            player.car.position.x = startX;
            player.car.rotation.z = 0;
            player.currentTilt = 0;
            player.targetTilt = 0;

            inputBuffer.clear();

            // Update player car color
            const levelColor = LEVELS[uiState.selectedLevel].color;
            player.car.children.forEach(child => {
                if (child.material && child.material.color && child.material.metalness > 0.7) {
                    child.material.color.set(levelColor);
                }
            });

            // Clear traffic
            traffic.forEach(vehicle => {
                scene.remove(vehicle.car);
                vehicle.car.visible = false;
                trafficPool.push(vehicle.car);
            });
            traffic.length = 0;

            lastSpawnTime = 0;

            setGameState(prev => ({
                ...prev,
                running: true,
                showGameOver: false,
                score: 0,
                distance: 0,
                combo: 0,
                speed: 0,
                level: uiState.selectedLevel,
            }));
        }

        // ============================================
        // OPTIMIZED ANIMATION LOOP WITH FIXED TIMESTEP
        // ============================================
        let animationId;
        let lastTime = performance.now();
        let accumulator = 0;
        const fixedDeltaTime = 1 / 60; // 60 FPS target

        function animate(currentTime) {
            animationId = requestAnimationFrame(animate);

            let deltaTime = (currentTime - lastTime) / 1000;
            lastTime = currentTime;

            // Cap delta time to prevent spiral of death
            if (deltaTime > 0.1) deltaTime = 0.1;

            accumulator += deltaTime;

            // Fixed timestep updates for physics
            while (accumulator >= fixedDeltaTime) {
                if (internalState.running) {
                    updatePlayer(fixedDeltaTime);
                    updateTraffic(fixedDeltaTime);
                    updateDifficulty();
                    checkLevelUp();
                    updateCombo();
                    spawnTraffic();
                }
                accumulator -= fixedDeltaTime;
            }

            if (internalState.running) {
                // Variable timestep updates for visuals
                updateRoad(deltaTime);
                updateGameState();
                monitorPerformance();

                // Smooth light pulsing
                const time = currentTime * 0.001;
                streetLights.forEach((lightObj) => {
                    const { light, baseIntensity, phase } = lightObj;
                    lightObj.targetIntensity = baseIntensity + Math.sin(time * 2 + phase) * 0.8;
                    lightObj.currentIntensity = Interpolation.lerp(
                        lightObj.currentIntensity,
                        lightObj.targetIntensity,
                        0.1,
                        deltaTime
                    );
                    light.intensity = lightObj.currentIntensity;
                });

                // Ultra-smooth camera movement
                const speedFactor = internalState.playerSpeed / CONFIG.maxPlayerSpeed;
                const targetCameraY = 10 + Math.sin(time * 5) * speedFactor * 0.3;
                const targetCameraZ = 18 - speedFactor * 2;

                camera.position.y = Interpolation.lerp(
                    camera.position.y,
                    targetCameraY,
                    CONFIG.interpolation.camera,
                    deltaTime
                );
                camera.position.z = Interpolation.lerp(
                    camera.position.z,
                    targetCameraZ,
                    CONFIG.interpolation.camera,
                    deltaTime
                );

                // Subtle camera shake at high speed
                if (speedFactor > 0.7) {
                    const targetShake = Math.sin(time * 15) * speedFactor * 0.15;
                    camera.position.x = Interpolation.lerp(
                        camera.position.x,
                        targetShake,
                        0.2,
                        deltaTime
                    );
                } else {
                    camera.position.x = Interpolation.lerp(
                        camera.position.x,
                        0,
                        0.15,
                        deltaTime
                    );
                }

                camera.lookAt(0, 0, -5);
            }

            renderer.render(scene, camera);
        }

        animate(performance.now());

        // Optimized resize handler
        let resizeTimeout;
        function handleResize() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (!mountRef.current) return;
                camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
            }, 150);
        }

        window.addEventListener('resize', handleResize);

        setTimeout(startGame, 500);

        window.startTrafficGame = startGame;
        window.changeLane = changeLane;

        // ============================================
        // CLEANUP
        // ============================================
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
            clearTimeout(resizeTimeout);

            // Dispose geometries
            Object.values(carGeometryCache).forEach(geometry => {
                if (geometry.dispose) geometry.dispose();
            });

            Object.values(lightGeometries).forEach(geometry => {
                if (geometry.dispose) geometry.dispose();
            });

            // Dispose materials
            materialCache.forEach(material => {
                if (material.dispose) material.dispose();
            });
            materialCache.clear();

            if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, [uiState.showMenu, uiState.selectedLevel]);

    const handleStartGame = useCallback((level) => {
        setUiState({ showMenu: false, selectedLevel: level });
    }, []);

    const handleBackToMenu = useCallback(() => {
        setGameState(prev => ({ ...prev, showGameOver: false }));
        setUiState({ showMenu: true, selectedLevel: 1 });
    }, []);

    if (uiState.showMenu) {
        return <MainMenu onStartGame={handleStartGame} bestScore={gameState.bestScore} />;
    }

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 50%, #16213e 100%)',
            fontFamily: "'Rajdhani', sans-serif",
            position: 'relative'
        }}>
            <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

            <PremiumHUD gameState={gameState} />

            {gameState.showLevelUp && <LevelUpNotification level={gameState.level} />}

            {gameState.showGameOver && (
                <GameOverScreen
                    gameState={gameState}
                    onRestart={() => window.startTrafficGame && window.startTrafficGame()}
                    onMenu={handleBackToMenu}
                />
            )}

            {/Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent) && gameState.running && (
                <MobileControls />
            )}

            {gameState.running && (
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(10, 10, 30, 0.75)',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 243, 255, 0.25)',
                    backdropFilter: 'blur(8px)',
                    fontSize: '13px',
                    color: '#00f3ff',
                    textAlign: 'center',
                    pointerEvents: 'none',
                    opacity: 0.65
                }}>
                    ← → / A D: Lane | ↑ W: Accelerate | ↓ S: Brake | SPACE/SHIFT: Nitro
                </div>
            )}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;500;700;900&display=swap');
            `}</style>
        </div>
    );
};

// UI Components remain the same...
const MainMenu = React.memo(({ onStartGame, bestScore }) => {
    const [selectedLevel, setSelectedLevel] = useState(1);

    const levels = [
        { id: 1, name: 'ROOKIE', color: '#00ff00', desc: 'Easy cruise', gradient: 'linear-gradient(135deg, #00ff00, #00cc00)' },
        { id: 2, name: 'DRIVER', color: '#00f3ff', desc: 'Getting serious', gradient: 'linear-gradient(135deg, #00f3ff, #0099ff)' },
        { id: 3, name: 'RACER', color: '#fffc00', desc: 'Speed demon', gradient: 'linear-gradient(135deg, #fffc00, #ffaa00)' },
        { id: 4, name: 'PRO', color: '#ff6b00', desc: 'Expert only', gradient: 'linear-gradient(135deg, #ff6b00, #ff0000)' },
        { id: 5, name: 'LEGEND', color: '#ff00ea', desc: 'Impossible', gradient: 'linear-gradient(135deg, #ff00ea, #9d00ff)' },
    ];

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 50%, #16213e 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: "'Rajdhani', sans-serif",
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 50% 50%, rgba(0, 243, 255, 0.08), transparent 50%)',
                animation: 'pulse 4s infinite'
            }} />

            <h1 style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: 'clamp(48px, 8vw, 96px)',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #00f3ff, #ff00ea, #fffc00)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '20px',
                textShadow: '0 0 60px rgba(0, 243, 255, 0.4)',
                animation: 'glow 2s ease-in-out infinite',
                zIndex: 1,
                textAlign: 'center',
                padding: '0 20px'
            }}>
                TRAFFIC DODGE 3D
            </h1>

            <p style={{
                fontSize: 'clamp(18px, 3vw, 24px)',
                color: '#00f3ff',
                marginBottom: '30px',
                zIndex: 1,
                textShadow: '0 0 15px rgba(0, 243, 255, 0.4)'
            }}>
                BEST SCORE: {bestScore}
            </p>

            <div style={{ marginBottom: '30px', zIndex: 1, padding: '0 20px', width: '100%', maxWidth: '700px' }}>
                <h2 style={{
                    fontSize: 'clamp(20px, 3.5vw, 32px)',
                    color: '#ffffff',
                    marginBottom: '20px',
                    textAlign: 'center',
                    fontWeight: 700,
                    textShadow: '0 0 15px rgba(255, 255, 255, 0.25)'
                }}>
                    SELECT LEVEL
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                    gap: '12px',
                    marginBottom: '20px',
                    maxWidth: '650px',
                    margin: '0 auto'
                }}>
                    {levels.map(level => (
                        <button
                            key={level.id}
                            onClick={() => setSelectedLevel(level.id)}
                            style={{
                                padding: 'clamp(12px, 2vw, 20px)',
                                background: selectedLevel === level.id
                                    ? level.gradient
                                    : 'rgba(20, 20, 40, 0.75)',
                                border: `2px solid ${level.color}`,
                                borderRadius: '12px',
                                color: '#ffffff',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                boxShadow: selectedLevel === level.id
                                    ? `0 0 25px ${level.color}`
                                    : 'none',
                                transform: selectedLevel === level.id ? 'scale(1.05)' : 'scale(1)',
                                backdropFilter: 'blur(8px)'
                            }}
                        >
                            <div style={{
                                fontFamily: "'Orbitron', monospace",
                                fontSize: 'clamp(14px, 2vw, 20px)',
                                fontWeight: 900,
                                marginBottom: '4px'
                            }}>
                                {level.name}
                            </div>
                            <div style={{
                                fontSize: 'clamp(10px, 1.5vw, 12px)',
                                opacity: 0.8
                            }}>
                                {level.desc}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={() => onStartGame(selectedLevel)}
                style={{
                    padding: 'clamp(15px, 3vw, 25px) clamp(40px, 8vw, 70px)',
                    fontFamily: "'Orbitron', monospace",
                    fontSize: 'clamp(20px, 4vw, 32px)',
                    fontWeight: 900,
                    background: levels[selectedLevel - 1].gradient,
                    border: `3px solid ${levels[selectedLevel - 1].color}`,
                    borderRadius: '50px',
                    color: '#ffffff',
                    cursor: 'pointer',
                    boxShadow: `0 0 40px ${levels[selectedLevel - 1].color}`,
                    textTransform: 'uppercase',
                    letterSpacing: '3px',
                    transition: 'all 0.3s',
                    zIndex: 1,
                    animation: 'pulse 2s infinite'
                }}
                onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-3px) scale(1.03)';
                    e.target.style.boxShadow = `0 0 60px ${levels[selectedLevel - 1].color}`;
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = `0 0 40px ${levels[selectedLevel - 1].color}`;
                }}
            >
                START RACE
            </button>

            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.015); opacity: 0.92; }
                }
                @keyframes glow {
                    0%, 100% { text-shadow: 0 0 35px rgba(0, 243, 255, 0.4); }
                    50% { text-shadow: 0 0 50px rgba(0, 243, 255, 0.6), 0 0 70px rgba(255, 0, 234, 0.4); }
                }
            `}</style>
        </div>
    );
});

const PremiumHUD = React.memo(({ gameState }) => {
    const levels = {
        1: { name: 'ROOKIE', color: '#00ff00' },
        2: { name: 'DRIVER', color: '#00f3ff' },
        3: { name: 'RACER', color: '#fffc00' },
        4: { name: 'PRO', color: '#ff6b00' },
        5: { name: 'LEGEND', color: '#ff00ea' },
    };

    return (
        <>
            <div style={{
                position: 'absolute',
                top: '15px',
                left: '15px',
                right: '15px',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                gap: '10px',
                pointerEvents: 'none',
                zIndex: 100
            }}>
                <HUDPanel label="SCORE" value={gameState.score} highlight />
                <HUDPanel label="DISTANCE" value={`${gameState.distance}M`} />
                <HUDPanel
                    label="LEVEL"
                    value={levels[gameState.level].name}
                    color={levels[gameState.level].color}
                />
                <HUDPanel label="BEST" value={gameState.bestScore} />
            </div>

            <div style={{
                position: 'absolute',
                bottom: '25px',
                left: '25px',
                width: 'clamp(120px, 20vw, 180px)',
                height: 'clamp(120px, 20vw, 180px)',
                pointerEvents: 'none'
            }}>
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(10, 10, 30, 0.92), rgba(20, 20, 50, 0.88))',
                        border: '3px solid #ff00ea',
                        boxShadow: '0 0 30px rgba(255, 0, 234, 0.4), inset 0 0 20px rgba(255, 0, 234, 0.15)'
                    }} />

                    <div style={{
                        position: 'absolute',
                        bottom: '50%',
                        left: '50%',
                        width: '5px',
                        height: '65px',
                        background: 'linear-gradient(to top, #fffc00, #ff6b00)',
                        transformOrigin: 'bottom center',
                        transform: `translateX(-50%) rotate(${-135 + (gameState.speed / 250) * 270}deg)`,
                        transition: 'transform 0.15s ease-out',
                        boxShadow: '0 0 15px #fffc00',
                        borderRadius: '2px'
                    }} />
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, #fffc00, #ff6b00)',
                        boxShadow: '0 0 20px #fffc00'
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '32%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontFamily: "'Orbitron', monospace",
                        fontSize: 'clamp(18px, 4vw, 28px)',
                        fontWeight: 900,
                        color: '#ffffff',
                        textShadow: '0 0 12px #fffc00'
                    }}>
                        {gameState.speed}
                    </div>
                    <div style={{
                        position: 'absolute',
                        bottom: '22%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: 'clamp(8px, 1.5vw, 11px)',
                        color: '#ff00ea',
                        fontWeight: 'bold',
                        letterSpacing: '1.5px'
                    }}>
                        KM/H
                    </div>
                </div>
            </div>

            <TrafficLight />

            {gameState.combo > 2 && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    right: 'clamp(15px, 3vw, 30px)',
                    transform: 'translateY(-50%)',
                    background: 'linear-gradient(135deg, rgba(255, 0, 234, 0.92), rgba(255, 100, 0, 0.92))',
                    border: '3px solid #ff00ea',
                    borderRadius: '15px',
                    padding: 'clamp(15px, 3vw, 25px) clamp(20px, 4vw, 35px)',
                    boxShadow: '0 0 40px rgba(255, 0, 234, 0.6)',
                    animation: 'comboPulse 0.5s infinite'
                }}>
                    <div style={{
                        fontFamily: "'Orbitron', monospace",
                        fontSize: 'clamp(36px, 8vw, 64px)',
                        fontWeight: 900,
                        color: '#ffffff',
                        textShadow: '0 0 20px #ff00ea',
                        lineHeight: 1
                    }}>
                        {gameState.combo}
                    </div>
                    <div style={{
                        fontSize: 'clamp(12px, 2vw, 16px)',
                        color: '#fffc00',
                        fontWeight: 900,
                        letterSpacing: '2px',
                        marginTop: '6px',
                        textAlign: 'center'
                    }}>
                        COMBO
                    </div>
                </div>
            )}

            <style>{`
                @keyframes comboPulse {
                    0%, 100% { transform: translateY(-50%) scale(1); }
                    50% { transform: translateY(-50%) scale(1.04); }
                }
            `}</style>
        </>
    );
});

const HUDPanel = React.memo(({ label, value, highlight, color }) => (
    <div style={{
        background: 'linear-gradient(135deg, rgba(10, 10, 30, 0.92), rgba(20, 20, 50, 0.88))',
        border: `2px solid ${color || (highlight ? '#fffc00' : '#00f3ff')}`,
        borderRadius: '10px',
        padding: 'clamp(10px, 2vw, 15px) clamp(15px, 3vw, 25px)',
        boxShadow: `0 0 ${highlight ? '30' : '20'}px ${color || (highlight ? 'rgba(255, 252, 0, 0.35)' : 'rgba(0, 243, 255, 0.25)')}, inset 0 0 15px rgba(0, 243, 255, 0.08)`,
        backdropFilter: 'blur(8px)',
        minWidth: 'clamp(80px, 15vw, 120px)'
    }}>
        <div style={{
            fontSize: 'clamp(8px, 1.5vw, 10px)',
            color: color || (highlight ? '#fffc00' : '#00f3ff'),
            fontWeight: 'bold',
            letterSpacing: '1.5px',
            marginBottom: '4px',
            textShadow: `0 0 8px ${color || (highlight ? '#fffc00' : '#00f3ff')}`
        }}>
            {label}
        </div>
        <div style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: highlight ? 'clamp(20px, 4vw, 32px)' : 'clamp(16px, 3vw, 24px)',
            fontWeight: 900,
            color: '#ffffff',
            textShadow: `0 0 15px ${color || (highlight ? '#fffc00' : '#00f3ff')}`,
            lineHeight: 1
        }}>
            {value}
        </div>
    </div>
));

const TrafficLight = React.memo(() => (
    <div style={{
        position: 'absolute',
        top: 'clamp(100px, 15vh, 130px)',
        right: 'clamp(15px, 3vw, 25px)',
        width: 'clamp(60px, 10vw, 80px)',
        background: 'linear-gradient(135deg, rgba(10, 10, 30, 0.92), rgba(20, 20, 50, 0.88))',
        border: '2px solid #00f3ff',
        borderRadius: '14px',
        padding: 'clamp(12px, 2vw, 16px)',
        boxShadow: '0 0 25px rgba(0, 243, 255, 0.35)',
        backdropFilter: 'blur(8px)'
    }}>
        {['#ff0000', '#fffc00', '#00ff00'].map((color, idx) => (
            <div key={idx} style={{
                width: 'clamp(35px, 6vw, 48px)',
                height: 'clamp(35px, 6vw, 48px)',
                borderRadius: '50%',
                margin: 'clamp(8px, 1.5vw, 10px) auto',
                background: idx === 2
                    ? `radial-gradient(circle, ${color}, ${color}dd)`
                    : '#1a1a1a',
                boxShadow: idx === 2
                    ? `0 0 25px ${color}, 0 0 45px ${color}, inset 0 0 12px rgba(255, 255, 255, 0.25)`
                    : 'inset 0 0 8px rgba(0, 0, 0, 0.6)',
                transition: 'all 0.3s'
            }} />
        ))}
    </div>
));

const LevelUpNotification = React.memo(({ level }) => {
    const levels = {
        1: { name: 'ROOKIE', color: '#00ff00' },
        2: { name: 'DRIVER', color: '#00f3ff' },
        3: { name: 'RACER', color: '#fffc00' },
        4: { name: 'PRO', color: '#ff6b00' },
        5: { name: 'LEGEND', color: '#ff00ea' },
    };

    return (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: "'Orbitron', monospace",
            fontSize: 'clamp(36px, 8vw, 64px)',
            fontWeight: 900,
            color: levels[level].color,
            textShadow: `0 0 30px ${levels[level].color}, 0 0 60px ${levels[level].color}`,
            zIndex: 200,
            animation: 'levelUpAnim 2s ease-out',
            pointerEvents: 'none',
            textAlign: 'center',
            padding: '0 20px'
        }}>
            <div>LEVEL UP!</div>
            <div style={{ fontSize: 'clamp(28px, 6vw, 48px)', marginTop: '8px' }}>{levels[level].name}</div>

            <style>{`
                @keyframes levelUpAnim {
                    0% {
                        transform: translate(-50%, -50%) scale(0);
                        opacity: 0;
                    }
                    50% {
                        transform: translate(-50%, -50%) scale(1.2);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
});

const GameOverScreen = React.memo(({ gameState, onRestart, onMenu }) => {
    const levels = {
        1: { name: 'ROOKIE', color: '#00ff00' },
        2: { name: 'DRIVER', color: '#00f3ff' },
        3: { name: 'RACER', color: '#fffc00' },
        4: { name: 'PRO', color: '#ff6b00' },
        5: { name: 'LEGEND', color: '#ff00ea' },
    };

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(10, 10, 30, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 300,
            backdropFilter: 'blur(20px)',
            animation: 'fadeIn 0.5s ease-out',
            padding: '20px',
            overflowY: 'auto'
        }}>
            <h1 style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: 'clamp(48px, 10vw, 96px)',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #ff00ea, #00f3ff, #fffc00, #ff6b00)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 'clamp(30px, 5vh, 50px)',
                animation: 'glitch 1s infinite',
                textShadow: '0 0 60px rgba(255, 0, 234, 0.5)',
                textAlign: 'center'
            }}>
                GAME OVER
            </h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'clamp(15px, 3vw, 30px)',
                marginBottom: 'clamp(30px, 5vh, 50px)',
                maxWidth: '800px',
                width: '100%'
            }}>
                <StatCard label="FINAL SCORE" value={gameState.score} color="#fffc00" />
                <StatCard label="BEST SCORE" value={gameState.bestScore} color="#00f3ff" />
                <StatCard label="DISTANCE" value={`${gameState.distance}M`} color="#00ff00" />
                <StatCard label="MAX COMBO" value={gameState.maxCombo} color="#ff00ea" />
                <StatCard label="TOP SPEED" value={`${gameState.speed} KM/H`} color="#ff6b00" />
                <StatCard
                    label="FINAL LEVEL"
                    value={levels[gameState.level].name}
                    color={levels[gameState.level].color}
                />
            </div>

            <div style={{ display: 'flex', gap: 'clamp(15px, 3vw, 25px)', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                    onClick={onRestart}
                    style={{
                        padding: 'clamp(12px, 2.5vw, 20px) clamp(35px, 7vw, 60px)',
                        fontFamily: "'Orbitron', monospace",
                        fontSize: 'clamp(18px, 3.5vw, 28px)',
                        fontWeight: 900,
                        background: 'linear-gradient(135deg, #00ff00, #00cc00)',
                        border: '3px solid #00ff00',
                        borderRadius: '45px',
                        color: '#ffffff',
                        cursor: 'pointer',
                        boxShadow: '0 0 40px rgba(0, 255, 0, 0.6)',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-3px) scale(1.03)';
                        e.target.style.boxShadow = '0 0 60px rgba(0, 255, 0, 0.8)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0) scale(1)';
                        e.target.style.boxShadow = '0 0 40px rgba(0, 255, 0, 0.6)';
                    }}
                >
                    RESTART
                </button>

                <button
                    onClick={onMenu}
                    style={{
                        padding: 'clamp(12px, 2.5vw, 20px) clamp(35px, 7vw, 60px)',
                        fontFamily: "'Orbitron', monospace",
                        fontSize: 'clamp(18px, 3.5vw, 28px)',
                        fontWeight: 900,
                        background: 'linear-gradient(135deg, #ff00ea, #9d00ff)',
                        border: '3px solid #ff00ea',
                        borderRadius: '45px',
                        color: '#ffffff',
                        cursor: 'pointer',
                        boxShadow: '0 0 40px rgba(255, 0, 234, 0.6)',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-3px) scale(1.03)';
                        e.target.style.boxShadow = '0 0 60px rgba(255, 0, 234, 0.8)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0) scale(1)';
                        e.target.style.boxShadow = '0 0 40px rgba(255, 0, 234, 0.6)';
                    }}
                >
                    MENU
                </button>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes glitch {
                    0%, 100% { transform: translate(0); }
                    20% { transform: translate(-2px, 2px); }
                    40% { transform: translate(-2px, -2px); }
                    60% { transform: translate(2px, 2px); }
                    80% { transform: translate(2px, -2px); }
                }
            `}</style>
        </div>
    );
});

const StatCard = React.memo(({ label, value, color = '#00f3ff' }) => (
    <div style={{
        background: 'linear-gradient(135deg, rgba(10, 10, 30, 0.92), rgba(20, 20, 50, 0.88))',
        border: `2px solid ${color}`,
        borderRadius: '14px',
        padding: 'clamp(18px, 3vw, 30px)',
        minWidth: '180px',
        boxShadow: `0 0 30px ${color}35`,
        backdropFilter: 'blur(8px)'
    }}>
        <div style={{
            fontSize: 'clamp(11px, 2vw, 14px)',
            color: color,
            fontWeight: 'bold',
            letterSpacing: '1.5px',
            marginBottom: '8px',
            textShadow: `0 0 8px ${color}`
        }}>
            {label}
        </div>
        <div style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 900,
            color: '#ffffff',
            textShadow: `0 0 20px ${color}`
        }}>
            {value}
        </div>
    </div>
));

const MobileControls = React.memo(() => (
    <div style={{
        position: 'absolute',
        bottom: 'clamp(80px, 12vh, 100px)',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 'clamp(25px, 5vw, 45px)',
        zIndex: 100
    }}>
        <MobileButton
            icon="◄"
            onClick={() => window.changeLane && window.changeLane(-1)}
            color="#00f3ff"
        />
        <MobileButton
            icon="▲"
            onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))}
            color="#00ff00"
            label="BOOST"
        />
        <MobileButton
            icon="►"
            onClick={() => window.changeLane && window.changeLane(1)}
            color="#ff00ea"
        />
    </div>
));

const MobileButton = React.memo(({ icon, onClick, color, label }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {label && (
            <div style={{
                fontSize: 'clamp(9px, 1.5vw, 11px)',
                color: color,
                fontWeight: 'bold',
                marginBottom: '4px',
                letterSpacing: '0.8px'
            }}>
                {label}
            </div>
        )}
        <div
            onClick={onClick}
            style={{
                width: 'clamp(70px, 12vw, 100px)',
                height: 'clamp(70px, 12vw, 100px)',
                background: `linear-gradient(135deg, ${color}35, ${color}18)`,
                border: `3px solid ${color}`,
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 'clamp(32px, 6vw, 48px)',
                color: '#ffffff',
                cursor: 'pointer',
                userSelect: 'none',
                boxShadow: `0 0 25px ${color}70`,
                transition: 'all 0.2s',
                pointerEvents: 'auto',
                fontWeight: 'bold'
            }}
            onTouchStart={(e) => {
                e.target.style.transform = 'scale(0.92)';
                e.target.style.boxShadow = `0 0 40px ${color}`;
            }}
            onTouchEnd={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = `0 0 25px ${color}70`;
            }}
        >
            {icon}
        </div>
    </div>
));

export default TrafficDodge3D;