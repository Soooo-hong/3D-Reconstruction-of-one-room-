const glb_path2 = localStorage.getItem('RenderingImages');
var room_count =Number( localStorage.getItem('Room_count'));

var glb_path = 'web/frontend/static/glb/'+glb_path2
//var glb_path = '../static/glb/test1.glb'
// 버튼 클릭 이벤트 리스너 등록
document.getElementById('load3dButton').addEventListener('click', function() {
    load3DModel(room_count, glb_path); // 모델을 로드하는 함수 호출


    // 버튼을 숨기기
    this.style.display = 'none';
});

let plane1, plane2, plane3;
let intersects;
//3D 

function load3DModel(room_count, glb_path) {
    const resetButton = document.getElementById('reset');
    const room1Button = document.getElementById('room1');
    const room2Button = document.getElementById('room2');
    const room3Button = document.getElementById('room3');
    resetButton.style.display = 'inline-block';
    // room_count에 따라 버튼을 표시
    if (room_count >= 1) {
        room1Button.style.display = 'inline-block'; // room1 버튼 표시
    }
    if (room_count >= 2) {
        room2Button.style.display = 'inline-block'; // room2 버튼 표시
    }
    if (room_count >= 3) {
        room3Button.style.display = 'inline-block'; // room3 버튼 표시
    }

    const container = document.getElementById('threeDcontainer');
    // 씬 생성
    const scene = new THREE.Scene();
   
    // 카메라 생성
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(66, 5, 60);//x : 좌우, y : 높이, z: 전후
    // 렌더러 생성
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x172627);
    document.body.appendChild(renderer.domElement);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('threeDcontainer').appendChild(renderer.domElement);


    //container.appendChild(renderer.domElement);
    let intersectedObject = null;

    // RGBELoader를 사용하여 HDRI 배경 로드
    const rgbeLoader = new THREE.RGBELoader();
    rgbeLoader.load('../static/images/bg_1.hdr', function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping; // HDRI 매핑 방식 설정
        scene.background = texture; // HDRI를 배경으로 설정
        scene.environment = texture; // HDRI를 조명 및 반사 맵으로 사용
    });

    //프메 로고 사진 배경에 추가
    var img = new THREE.MeshBasicMaterial({ 
        map:THREE.ImageUtils.loadTexture('../static/images/pm_logo.png')
    });
    img.map.needsUpdate = true; //ADDED
    var plane_pmlogo = new THREE.Mesh(new THREE.PlaneGeometry(690, 320),img);
    plane_pmlogo.overdraw = true;
    plane_pmlogo.position.set(110, 95, 600);
    plane_pmlogo.rotation.y = Math.PI; //이미지 뒤집기
    scene.add(plane_pmlogo);

    //서울 지도 사진 배경에 추가
    var img2 = new THREE.MeshBasicMaterial({ 
        map:THREE.ImageUtils.loadTexture('../static/images/framed_map.png')
    });
    var plane_map = new THREE.Mesh(new THREE.PlaneGeometry(140, 95),img2);
    plane_map.rotation.y = Math.PI / 2;
    plane_map.overdraw = true;
    plane_map.position.set(-200, 28, 65);
    scene.add(plane_map);

    //프로젝트 소개 사진 배경에 추가
    var img3 = new THREE.MeshBasicMaterial({ 
        map:THREE.ImageUtils.loadTexture('../static/images/intro_final.png')
    });
    var plane_intro = new THREE.Mesh(new THREE.PlaneGeometry(510, 250),img3);
    plane_intro.overdraw = true;
    plane_intro.position.set(63, 150, -500);
    scene.add(plane_intro);

    // 조명 추가
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2); // 첫 번째 방향 조명
    directionalLight1.position.set(5, 5, 5).normalize();
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2); // 두 번째 방향 조명
    directionalLight2.position.set(-5, 5, -5).normalize();
    scene.add(directionalLight2);

    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 2); // 첫 번째 방향 조명
    directionalLight3.position.set(5, -5, -5).normalize();
    scene.add(directionalLight3);

    const directionalLight4 = new THREE.DirectionalLight(0xffffff, 2); // 두 번째 방향 조명
    directionalLight4.position.set(-5, -5, 5).normalize();
    scene.add(directionalLight4);

    // 전체적인 밝기를 위한 조명 추가
    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // AmbientLight 추가, 강도 0.5
    scene.add(ambientLight);
    // OrbitControls 추가
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(66, 5, 59);
    controls.update();

    // 창 크기 조정에 대응
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // GLTFLoader를 사용하여 GLB 모델 로드

    const loader = new THREE.GLTFLoader();
    const models = {}; 
    loader.load(glb_path, function(gltf1) {
        const model1 = gltf1.scene;
        scene.add(model1);
        model1.position.set(-2, -10, 0); //위치 선정
        model1.scale.set(50, 50, 50);

        let mixer1;
        if (gltf1.animations && gltf1.animations.length > 0) {
            mixer1 = new THREE.AnimationMixer(model1);
            gltf1.animations.forEach((clip) => {
                mixer1.clipAction(clip).play();
            });
        }
        models.model1 = model1;

        
        
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        function drawTextOnCanvas(context, text, bgColor) {
            context.fillStyle = bgColor; // 배경 색
            context.fillRect(0, 0, context.canvas.width, context.canvas.height); // 배경 채우기
            context.fillStyle = 'white'; // 텍스트 색상
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.font = '80px Arial';
            context.fillText(text, context.canvas.width / 2, context.canvas.height / 2);
        }

        if (room_count==1)//원룸 한 개인 경우
        {
            //원룸1 정보 
            const canvas1 = document.createElement('canvas');
            canvas1.width = 1024;
            canvas1.height = 512;
            const context1 = canvas1.getContext('2d');
            context1.font = '80px Arial';
            context1.fillStyle = 'white';
            context1.textAlign = 'center';
            context1.textBaseline = 'middle';
            context1.fillText('원룸 1', canvas1.width / 2, canvas1.height / 2);
            const texture1 = new THREE.CanvasTexture(canvas1);
            const planeGeometry1 = new THREE.PlaneGeometry(25, 12);
            const planeMaterial1 = new THREE.MeshBasicMaterial({ map: texture1, side: THREE.DoubleSide });
            plane1 = new THREE.Mesh(planeGeometry1, planeMaterial1);
            plane1.position.set(-10, 0, -12.5); // 원룸 1 정보
            scene.add(plane1);

            const intersects = raycaster.intersectObjects([plane1]);

                        // 각 plane에 텍스트 데이터 추가
            plane1.userData.text = '원룸 1';

        }
        else if (room_count==2)//원룸 두 개인 경우
        {
            //원룸1 정보 
            const canvas1 = document.createElement('canvas');
            canvas1.width = 1024;
            canvas1.height = 512;
            const context1 = canvas1.getContext('2d');
            context1.font = '80px Arial';
            context1.fillStyle = 'white';
            context1.textAlign = 'center';
            context1.textBaseline = 'middle';
            context1.fillText('원룸 1', canvas1.width / 2, canvas1.height / 2);
            const texture1 = new THREE.CanvasTexture(canvas1);
            const planeGeometry1 = new THREE.PlaneGeometry(25, 12);
            const planeMaterial1 = new THREE.MeshBasicMaterial({ map: texture1, side: THREE.DoubleSide });
            plane1 = new THREE.Mesh(planeGeometry1, planeMaterial1);
            plane1.position.set(-10, 3, -12.5); // 원룸 1 정보
            scene.add(plane1);

            //원룸2 정보 
            const canvas2 = document.createElement('canvas');
            canvas2.width = 1024;
            canvas2.height = 512;
            const context2 = canvas2.getContext('2d');
            context2.font = '80px Arial';
            context2.fillStyle = 'white';
            context2.textAlign = 'center';
            context2.textBaseline = 'middle';
            context2.fillText('원룸 2', canvas2.width / 2, canvas2.height / 2);
            const texture2 = new THREE.CanvasTexture(canvas2);
            const planeGeometry2 = new THREE.PlaneGeometry(25, 12);
            const planeMaterial2 = new THREE.MeshBasicMaterial({ map: texture2, side: THREE.DoubleSide });
            plane2 = new THREE.Mesh(planeGeometry2, planeMaterial2);
            plane2.position.set(52, 3, -12.5); // 원룸 1 정보
            scene.add(plane2);

        
            const intersects = raycaster.intersectObjects([plane1, plane2]);

                        // 각 plane에 텍스트 데이터 추가
            plane1.userData.text = '원룸 1';
            plane2.userData.text = '원룸 2';

        }
        else//원룸 세 개인 경우 
        {
            //원룸1 정보 
            const canvas1 = document.createElement('canvas');
            canvas1.width = 1024;
            canvas1.height = 512;
            const context1 = canvas1.getContext('2d');
            context1.font = '80px Arial';
            context1.fillStyle = 'white';
            context1.textAlign = 'center';
            context1.textBaseline = 'middle';
            context1.fillText('원룸 1', canvas1.width / 2, canvas1.height / 2);
            const texture1 = new THREE.CanvasTexture(canvas1);
            const planeGeometry1 = new THREE.PlaneGeometry(25, 12);
            const planeMaterial1 = new THREE.MeshBasicMaterial({ map: texture1, side: THREE.DoubleSide });
            plane1 = new THREE.Mesh(planeGeometry1, planeMaterial1);
            plane1.position.set(-10, 1.5, -12.5); // 원룸 1 정보
            scene.add(plane1);

            //원룸2 정보 
            const canvas2 = document.createElement('canvas');
            canvas2.width = 1024;
            canvas2.height = 512;
            const context2 = canvas2.getContext('2d');
            context2.font = '80px Arial';
            context2.fillStyle = 'white';
            context2.textAlign = 'center';
            context2.textBaseline = 'middle';
            context2.fillText('원룸 2', canvas2.width / 2, canvas2.height / 2);
            const texture2 = new THREE.CanvasTexture(canvas2);
            const planeGeometry2 = new THREE.PlaneGeometry(25, 12);
            const planeMaterial2 = new THREE.MeshBasicMaterial({ map: texture2, side: THREE.DoubleSide });
            plane2 = new THREE.Mesh(planeGeometry2, planeMaterial2);
            plane2.position.set(52, 1.5, -12.5); // 원룸 1 정보
            scene.add(plane2);

            //원룸3 정보 
            const canvas3 = document.createElement('canvas');
            canvas3.width = 1024;
            canvas3.height = 512;
            const context3 = canvas3.getContext('2d');
            context3.font = '80px Arial';
            context3.fillStyle = 'white';
            context3.textAlign = 'center';
            context3.textBaseline = 'middle';
            context3.fillText('원룸 3', canvas3.width / 2, canvas3.height / 2);
            const texture3= new THREE.CanvasTexture(canvas3);
            const planeGeometry3 = new THREE.PlaneGeometry(25, 12);
            const planeMaterial3 = new THREE.MeshBasicMaterial({ map: texture3, side: THREE.DoubleSide });
            plane3 = new THREE.Mesh(planeGeometry3, planeMaterial3);
            plane3.position.set(110, 1.5, -12.5); // 원룸 1 정보
            scene.add(plane3);
        
            
                        // 각 plane에 텍스트 데이터 추가
            plane1.userData.text = '원룸 1';
            plane2.userData.text = '원룸 2';
            plane3.userData.text = '원룸 3';
                
        }

        


            
        

        

        if (room_count==1){intersects = raycaster.intersectObjects([plane1]);}
        else if (room_count==2){intersects = raycaster.intersectObjects([plane1, plane2]);}
        else{intersects = raycaster.intersectObjects([plane1, plane2, plane3]);}

        document.getElementById('reset').addEventListener('click', function() {//room1 버튼 클릭 이벤트 처리 
            const target_plane1Position = new THREE.Vector3().copy(plane1.position);

            controls.target.set(66, 8, 59);
            controls.update();

            // 카메라 이동 애니메이션
            const duration = 1.5; // 이동 시간 (초)
            const startPosition = new THREE.Vector3().copy(camera.position);
            const endPosition = new THREE.Vector3(66, 5, 60);

            let startTime = null;

            function animateCamera(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsedTime = (timestamp - startTime) / 1500;

                // 카메라 위치를 선형 보간
                if (elapsedTime < duration) {
                    camera.position.lerpVectors(startPosition, endPosition, elapsedTime / duration);
                    requestAnimationFrame(animateCamera);
                } else {
                    camera.position.set(66, 8, 60);

                    // OrbitControls의 타겟 위치를 업데이트
                    
                }
            }
            requestAnimationFrame(animateCamera);
            
        });

        document.getElementById('room1').addEventListener('click', function() {//room1 버튼 클릭 이벤트 처리 
            const target_plane1Position = new THREE.Vector3().copy(plane1.position);

            // 카메라 이동 애니메이션
            const duration = 2; // 이동 시간 (초)
            const startPosition = new THREE.Vector3().copy(camera.position);
            const endPosition = new THREE.Vector3(target_plane1Position.x+5, target_plane1Position.y - 12, target_plane1Position.z + 21);

            let startTime = null;

            function animateCamera(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsedTime = (timestamp - startTime) / 1000;
                // OrbitControls의 타겟 위치를 업데이트
                controls.target.set(target_plane1Position.x+5, target_plane1Position.y - 12, target_plane1Position.z+ 23);
                controls.update();
                // 카메라 위치를 선형 보    간
                if (elapsedTime < duration) {
                    camera.position.lerpVectors(startPosition, endPosition, elapsedTime / duration);
                    requestAnimationFrame(animateCamera);
                } else {
                    camera.position.copy(endPosition);

                    
                }
            }
            requestAnimationFrame(animateCamera);
            
        });

        document.getElementById('room2').addEventListener('click', function() {//room2 버튼 클릭 이벤트 처리 
            const target_plane1Position = new THREE.Vector3().copy(plane2.position);

            // 카메라 이동 애니메이션
            const duration = 1.5; // 이동 시간 (초)
            const startPosition = new THREE.Vector3().copy(camera.position);
            const endPosition = new THREE.Vector3(target_plane1Position.x, target_plane1Position.y  - 12, target_plane1Position.z + 23);
            controls.target.set(target_plane1Position.x, target_plane1Position.y - 12, target_plane1Position.z+ 25);
            controls.update();
            let startTime = null;

            function animateCamera(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsedTime = (timestamp - startTime) / 1000;

                // 카메라 위치를 선형 보간
                if (elapsedTime < duration) {
                    camera.position.lerpVectors(startPosition, endPosition, elapsedTime / duration);
                    requestAnimationFrame(animateCamera);
                } else {
                    camera.position.copy(endPosition);

                    // OrbitControls의 타겟 위치를 업데이트
                    
                }
            }
            requestAnimationFrame(animateCamera);
            
        });

        document.getElementById('room3').addEventListener('click', function() {//room3 버튼 클릭 이벤트 처리 
            const target_plane1Position = new THREE.Vector3().copy(plane3.position);

            // 카메라 이동 애니메이션
            const duration = 1.5; // 이동 시간 (초)
            const startPosition = new THREE.Vector3().copy(camera.position);
            const endPosition = new THREE.Vector3(target_plane1Position.x-12, target_plane1Position.y - 12, target_plane1Position.z + 23);

            // OrbitControls의 타겟 위치를 업데이트
            controls.target.set(target_plane1Position.x-12, target_plane1Position.y - 12, target_plane1Position.z +25);
            controls.update();

            let startTime = null;

            function animateCamera(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsedTime = (timestamp - startTime) / 1000;

                // 카메라 위치를 선형 보간
                if (elapsedTime < duration) {
                    camera.position.lerpVectors(startPosition, endPosition, elapsedTime / duration);
                    requestAnimationFrame(animateCamera);
                } else {
                    camera.position.copy(endPosition);

                    
                }
            }
            requestAnimationFrame(animateCamera);
            
        });
        
        /*
        //원룸 정보 plane에 마우스 가져간 경우 처리 함수
        function onMouseMove(event) {
            // 마우스 좌표를 정규화
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
            // 카메라에서 마우스로 향하는 광선 생성
            raycaster.setFromCamera(mouse, camera);
        
            // 광선과 교차하는 물체 검색
            if (room_count==1){intersects = raycaster.intersectObjects([plane1]);}
            else if (room_count==2){intersects = raycaster.intersectObjects([plane1, plane2]);}
            else{intersects = raycaster.intersectObjects([plane1, plane2, plane3]);}
            //const intersects = raycaster.intersectObjects([plane1, plane2, plane3]);
            if (intersects.length > 0) {
                if (intersectedObject !== intersects[0].object) {
                    // 이전에 선택된 오브젝트가 있고, 새로운 오브젝트가 선택되면 색을 원래대로 되돌림
                    if (intersectedObject) {
                        const originalContext = intersectedObject.material.map.image.getContext('2d');
                        drawTextOnCanvas(originalContext, intersectedObject.userData.text, 'black');
                        intersectedObject.material.map.needsUpdate = true;
                    }
        
                    // 새로운 오브젝트 선택 및 배경 색상 변경
                    intersectedObject = intersects[0].object;
                    const context = intersectedObject.material.map.image.getContext('2d');
                    drawTextOnCanvas(context, intersectedObject.userData.text, 'blue'); // 마우스 오버 시 파란색 배경으로 변경
                    intersectedObject.material.map.needsUpdate = true;
                }
            } else {
                // 선택된 오브젝트가 없으면 초기화
                if (intersectedObject) {
                    const originalContext = intersectedObject.material.map.image.getContext('2d');
                    drawTextOnCanvas(originalContext, intersectedObject.userData.text, 'black');
                    intersectedObject.material.map.needsUpdate = true;
                    intersectedObject = null;
                }
            }
        }

        //원룸 정보 plane 클릭 처리 함수
        function onMouseClick(event) {
            // 마우스 좌표를 정규화
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
            // 카메라에서 마우스로 향하는 광선 생성
            raycaster.setFromCamera(mouse, camera);
        
            // 광선과 교차하는 물체 검색
            if (room_count==1){intersects = raycaster.intersectObjects([plane1]);}
            else if (room_count==2){intersects = raycaster.intersectObjects([plane1, plane2]);}
            else{intersects = raycaster.intersectObjects([plane1, plane2, plane3]);}
            //const intersects = raycaster.intersectObjects([plane1, plane2, plane3]);
        
            // 교차하는 물체가 있으면 카메라를 해당 위치로 이동
            if (intersects.length > 0) {
                const target = intersects[0].object;
                const targetPosition = new THREE.Vector3().copy(target.position);
                
                // 카메라 이동 애니메이션
                const duration = 1.5; // 이동 시간 (초)
                const startPosition = new THREE.Vector3().copy(camera.position);
                const endPosition = new THREE.Vector3(targetPosition.x, targetPosition.y-3, targetPosition.z+3.5);
                
                let startTime = null;
                function animateCamera(timestamp) {
                    if (!startTime) startTime = timestamp;
                    const elapsedTime = (timestamp - startTime) / 1000;
        
                    // 카메라 위치를 선형 보간
                    if (elapsedTime < duration) {
                        camera.position.lerpVectors(startPosition, endPosition, elapsedTime / duration);
                        requestAnimationFrame(animateCamera);
                    } else {
                        camera.position.copy(endPosition);

                        //controls.target.set(targetPosition.x, targetPosition.y-3, targetPosition.z+3.5);
                        //controls.update();
                        controls.target.set(targetPosition.x, targetPosition.y - 3, targetPosition.z + 15);
                        //controls.target.copy(targetPosition);
                        //controls.target.copy(targetPosition.x, targetPosition.y-3, targetPosition.z+3);
                        
                        controls.update();
                    }
                }
                requestAnimationFrame(animateCamera);
            }
        }
        window.addEventListener('click', onMouseClick, false);
        window.addEventListener('mousemove', onMouseMove, false);
        */


        
        // 마우스 클릭 이벤트 리스너 등록
        



        // 애니메이션 함수
        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            if (mixer1) mixer1.update(0.01);
            //if (mixer2) mixer2.update(0.01);
            renderer.render(scene, camera);
        }
        animate();

    }, undefined, function(error) {
        console.error('An error occurred while loading the first GLB model:', error);
    });


}