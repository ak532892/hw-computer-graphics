var camera, scene, renderer;
var controls; 
var torsoYFrame, torsoXFrame, headXFrame, headYFrame, handLXFrame, handLYFrame,
handRXFrame, handRYFrame,
skirtFrontFrame, skirtRearFrame, skirtLeftFrame, skirtRightFrame,
footLXFrame, footLYFrame, footRXFrame, footRYFrame;
var angle = 0;
var gcontrols;   // for dat-GUI
var controls;    // for orbitControls

init();
animate();

function init() {
	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.z = 400;
	
	scene.add(camera);
	
	var gridXZ = new THREE.GridHelper(100, 10);
	gridXZ.setColors(new THREE.Color(0xff00ff), new THREE.Color(0xffffff));
	scene.add(gridXZ);
	
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0x888888);
	
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	
	var light = new THREE.PointLight(0xffffff, 1);
	light.position.set(150, 150, 150);
	scene.add(light);
	var amblight = new THREE.AmbientLight(0x404040); // soft white light
	scene.add(amblight);
	document.body.appendChild(renderer.domElement);
	window.addEventListener('resize', onWindowResize, false);
	///////////////////////////////////////////////////////////////
	
	var headY = 34.5, torsoX = 27, torsoY = 31.5, footY = 30;
	var head = makeBoxHead(52.5, headY, 37.5, 0x884400);
	//first, 以旋轉的圓心為中心設新座標
	head.position.y = headY/2;
	headXFrame = makeLinkHead(head, headY, torsoX, torsoY, footY);
	headYFrame = new THREE.Object3D();
	headYFrame.add(headXFrame);
	scene.add(headYFrame);
	
	var torsoZ = 27;
	var torso = makeBoxTorso(torsoX, torsoY, torsoZ, 0x008844);
	
	torso.position.y = torsoY/2;
	torsoXFrame = makeLinkTorso(torso, headY, torsoX, footY);
	torsoYFrame = new THREE.Object3D();
	torsoYFrame.add(torsoXFrame);
	scene.add(torsoYFrame);
	//scene.add(torsoYFrame);
	
	var footX = 10.5, footZ = 24, footColor = 0xc2a57d;
	var footL = makeBox(footX, footY, footZ, footColor);
	var footR = makeBox(footX, footY, footZ, footColor);
	
	footL.position.y = -footY/2;
	footLXFrame = makeLinkFoot(footL, footX, footY, footZ, torsoX, "L");
	footLYFrame = new THREE.Object3D();
	footLYFrame.add(footLXFrame);
	scene.add(footLYFrame);
	
	footR.position.y = -footY/2;
	footRXFrame = makeLinkFoot(footR, footX, footY, footZ, torsoX, "R");
	footRYFrame = new THREE.Object3D();
	footRYFrame.add(footRXFrame);
	scene.add(footRYFrame);
	
	var handX = 27, handY = 9, handZ = 10.5;
	var handL = makeBox(handX, handY, handZ, footColor);
	var handR = makeBox(handX, handY, handZ, footColor);
	
	handL.position.x = -(handX/2);
	handR.position.x = handX/2;
	var handShift = 10;
	handLXFrame = makeLinkShoulder(handL, handY, handZ, handShift, torsoX, "L");
	handRXFrame = makeLinkShoulder(handR, handY, handZ, handShift, torsoX, "R");
	
	handLYFrame = new THREE.Object3D();
	handLYFrame.add(handLXFrame);
	scene.add(handLYFrame);
	
	handRYFrame = new THREE.Object3D();
	handRYFrame.add(handRXFrame);
	scene.add(handRYFrame);
	
	var skirtHeight = 10.5;
	var skirtFront = makeSkirt(torsoX, skirtHeight, footColor), 
	skirtRear = makeSkirt(torsoX, skirtHeight, footColor), 
	skirtLeft = makeSkirt(skirtHeight, torsoZ, footColor), 
	skirtRight = makeSkirt(skirtHeight, torsoZ, footColor);
	
	skirtFront.position.y = skirtHeight/2;
	skirtFrontFrame = new THREE.Object3D();
	skirtFrontFrame.add(skirtFront);
	//skirtFrontFrame.position.y = footY;
	skirtFrontFrame.position.z = torsoZ/2;
	skirtFrontFrame.rotation.x = (Math.PI + Math.PI/2)/2;
	//scene.add(skirtFrontFrame);
	
	skirtRear.position.y = skirtHeight/2;
	skirtRearFrame = new THREE.Object3D();
	skirtRearFrame.add(skirtRear);
	//skirtRearFrame.position.y = footY;
	skirtRearFrame.position.z = -torsoZ/2;
	skirtRearFrame.rotation.x = -skirtFrontFrame.rotation.x;
	//scene.add(skirtRearFrame);
	
	skirtLeft.rotation.x = Math.PI/2;
	skirtLeft.position.x = -skirtHeight/2;
	skirtLeftFrame = new THREE.Object3D();
	skirtLeftFrame.add(skirtLeft);
	//skirtLeftFrame.position.y = footY;
	skirtLeftFrame.position.x = -torsoX/2;
	skirtLeftFrame.rotation.z = (Math.PI - Math.PI/2)/2;
	//scene.add(skirtLeftFrame);
	
	skirtRight.rotation.x = Math.PI/2;
	skirtRight.position.x = skirtHeight/2;
	skirtRightFrame = new THREE.Object3D();
	skirtRightFrame.add(skirtRight);
	//skirtRightFrame.position.y = footY;
	skirtRightFrame.position.x = torsoX/2;
	skirtRightFrame.rotation.z = - skirtLeftFrame.rotation.z;
	//scene.add(skirtRightFrame);
	
	torsoXFrame.add(skirtFrontFrame);
	torsoXFrame.add(skirtRearFrame);
	torsoXFrame.add(skirtLeftFrame);
	torsoXFrame.add(skirtRightFrame);
	
	
	
	gcontrols = {
		headXAngle: 0.1,
		headYAngle: 0.1,
		handLeftXAngle: 0.1,
		handLeftYAngle: 0.1,
		handRightXAngle: 0.1,
		handRightYAngle: 0.1,
		torsoXAngle: 0.1,
		torsoYAngle: 0.1,
		footLeftXAngle: 0.1,
		footLeftYAngle: 0.1,
		footRightXAngle: 0.1,
		footRightYAngle: 0.1
	}
	
	var gui = new dat.GUI({load: loadJSON(), preset: 'pose1'});
	gui.remember (gcontrols);
	
	gui.add(gcontrols, 'headXAngle', -Math.PI, Math.PI);//min, max
	gui.add(gcontrols, 'headYAngle', -Math.PI, Math.PI);//min, max
	gui.add(gcontrols, 'handLeftXAngle', -Math.PI/2, Math.PI/2);
	gui.add(gcontrols, 'handLeftYAngle', -Math.PI/2, Math.PI/2);
	gui.add(gcontrols, 'handRightXAngle', -Math.PI/2, Math.PI/2);
	gui.add(gcontrols, 'handRightYAngle', -Math.PI/2, Math.PI/2);
	gui.add(gcontrols, 'torsoXAngle', -Math.PI, Math.PI);
	gui.add(gcontrols, 'torsoYAngle', -Math.PI, Math.PI);
	gui.add(gcontrols, 'footLeftXAngle', -Math.PI, Math.PI);
	gui.add(gcontrols, 'footLeftYAngle', -Math.PI, Math.PI);
	gui.add(gcontrols, 'footRightXAngle', -Math.PI, Math.PI);
	gui.add(gcontrols, 'footRightYAngle', -Math.PI, Math.PI);
}

function makeBoxHead(x, y, z, color) {
	var materials = [], material;
	// must give 6 materials for box geometry
	THREE.ImageUtils.crossOrigin = '';
	materials.push(new THREE.MeshLambertMaterial({side:THREE.DoubleSide, map:THREE.ImageUtils.loadTexture('http://i.imgur.com/RCbQBqa.png')}));
	materials.push(new THREE.MeshLambertMaterial({side:THREE.DoubleSide, map:THREE.ImageUtils.loadTexture('http://i.imgur.com/XMWMPFV.png')}));
	materials.push(new THREE.MeshLambertMaterial({side:THREE.DoubleSide, map:THREE.ImageUtils.loadTexture('http://i.imgur.com/NbLI98p.png')}));
	materials.push(new THREE.MeshLambertMaterial({visible:false}));
	materials.push(new THREE.MeshLambertMaterial({side:THREE.DoubleSide, map:THREE.ImageUtils.loadTexture('http://i.imgur.com/3YnIGh7.png')}));
	materials.push(new THREE.MeshLambertMaterial({side:THREE.DoubleSide, map:THREE.ImageUtils.loadTexture('http://i.imgur.com/xHWks9u.png')}));
	
	var material = new THREE.MeshFaceMaterial(materials);
	var geometry = new THREE.BoxGeometry(x, y, z);
	var boxMesh = new THREE.Mesh(geometry, material);
	
	return boxMesh;
}

function makeBoxTorso(x, y, z, color) {
	var materials = [], material;
	// must give 6 materials for box geometry
	THREE.ImageUtils.crossOrigin = '';
	materials.push(new THREE.MeshLambertMaterial({side:THREE.DoubleSide, map:THREE.ImageUtils.loadTexture('http://i.imgur.com/376MIgf.png')}));
	materials.push(new THREE.MeshLambertMaterial({side:THREE.DoubleSide, map:THREE.ImageUtils.loadTexture('http://i.imgur.com/VwSW4cZ.png')}));
	materials.push(new THREE.MeshLambertMaterial({side:THREE.DoubleSide, map:THREE.ImageUtils.loadTexture('http://i.imgur.com/ZtqJJS8.png')}));
	materials.push(new THREE.MeshLambertMaterial({visible:false}));
	materials.push(new THREE.MeshLambertMaterial({side:THREE.DoubleSide, map:THREE.ImageUtils.loadTexture('http://i.imgur.com/AN25drk.png')}));
	materials.push(new THREE.MeshLambertMaterial({side:THREE.DoubleSide, map:THREE.ImageUtils.loadTexture('http://i.imgur.com/eEle2S2.png')}));
	
	var material = new THREE.MeshFaceMaterial(materials);
	var geometry = new THREE.BoxGeometry(x, y, z);
	var boxMesh = new THREE.Mesh(geometry, material);
	
	return boxMesh;
}

function makeBox(x, y, z, color) {
	var material = new THREE.MeshLambertMaterial({
		//		wireframe: true,
		side: THREE.DoubleSide,
		color: color
	});
	var geometry = new THREE.BoxGeometry(x, y, z);
	var boxMesh = new THREE.Mesh(geometry, material);
	
	return boxMesh;
}

function makeLinkFoot(foot, footX, footY, footZ, torsoX, direct){
	var footFrame = new THREE.Object3D();
	
	footFrame.add(foot);
	if(direct == "L")
	footFrame.position.x = -(footX/2 + (torsoX/2-footX));
	else
	footFrame.position.x =  (footX/2 + (torsoX/2-footX));
	footFrame.position.y = footY;
	
	var geometry = new THREE.CylinderGeometry(footZ/2, footZ/2, footX, 12);
	var material = new THREE.MeshBasicMaterial({
		//wireframe: true
		visible: false
	});
	var joint = new THREE.Mesh(geometry, material);
	
	joint.rotation.z = Math.PI / 2;
 	footFrame.add(joint);
	
	return footFrame;
}

function makeLinkTorso(torso, headY, torsoX, footY){
	var frame = new THREE.Object3D();
	
	frame.add(torso);
	//second, 接著平移新座標
	frame.position.y = footY;
	
	var geometry = new THREE.CylinderGeometry(torsoX/2 - 3, torsoX/2, headY/2, 12);
	var material = new THREE.MeshBasicMaterial({
		//wireframe: true
		visible: false
	});
	var joint = new THREE.Mesh(geometry, material);
	
 	frame.add(joint);
	
	return frame;
}

function makeLinkHead(head, headY, torsoX, torsoY, footY){
	var frame = new THREE.Object3D();
	
	frame.add(head);
	//second, 接著平移新座標
	frame.position.y = torsoY+footY;
	
	var geometry = new THREE.CylinderGeometry(torsoX/2 - 3, torsoX/2, headY/2, 12);
	var material = new THREE.MeshBasicMaterial({
		//wireframe: true
		visible: false
	});
	var joint = new THREE.Mesh(geometry, material);
	
 	frame.add(joint);
	
	return frame;
}

function makeLinkShoulder(hand, handY, handZ, handShift, torsoX, direct){
	var handFrame = new THREE.Object3D();
	
	handFrame.add(hand);
	handFrame.position.y = headXFrame.position.y-handY/2-handShift;
	if(direct == "L")
	handFrame.position.x = -torsoX/2;
	else
	handFrame.position.x = torsoX/2;
    
	var geometry = new THREE.CylinderGeometry(handY/2, handY/2, handZ, 12);
	var material = new THREE.MeshBasicMaterial({
		//wireframe:true
		visible: false
	});
	var joint = new THREE.Mesh(geometry, material);
	
	joint.rotation.x = Math.PI / 2;
 	handFrame.add(joint);
	
	return handFrame;
} 

function makeSkirt(width, height, color) {
	var lid = new THREE.Object3D();
	
	var geometry = new THREE.PlaneGeometry(width, height);
	var material = new THREE.MeshLambertMaterial({
		side: THREE.DoubleSide,
		color: color
	});
	var lidPlane = new THREE.Mesh(geometry, material);
	
	lid.add(lidPlane);
	return lid;
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function loadJSON() {
	return {
		"preset": "pose3",
		"remembered": {
			"Default": {
				"0": {
					"headXAngle": 0,
					"headYAngle": 0,
					"handLeftXAngle": 0,
					"handLeftYAngle": 0,
					"handRightXAngle": 0,
					"handRightYAngle": 0,
					"torsoXAngle": 0,
					"torsoYAngle": 0,
					"footLeftXAngle": 0,
					"footLeftYAngle": 0,
					"footRightXAngle": 0,
					"footRightYAngle": 0
				}
			},
			"pose1": {
				"0": {
					"headXAngle": 0.2612940591223105,
					"headYAngle": 0.8057559331562465,
					"handLeftXAngle": 0.6751089035950915,
					"handLeftYAngle": 0.8452532392306971,
					"handRightXAngle": -0.4818725787270235,
					"handRightYAngle": 0.7091377707222128,
					"torsoXAngle": -0.017664080564585127,
					"torsoYAngle": 0.6696404646477623,
					"footLeftXAngle": 0.32935179337655196,
					"footLeftYAngle": 0.5335249961392781,
					"footRightXAngle": 0.32943909421599393,
					"footRightYAngle": 0.8738136674104888
				}
			},
			"pose2": {
				"0": {
					"headXAngle": -0.15650535047681657,
					"headYAngle": -0.295346620389048,
					"handLeftXAngle": -0.39064553254092904,
					"handLeftYAngle": -0.6336177548873341,
					"handRightXAngle": 0.44240208693245986,
					"handRightYAngle": -0.21709394515063973,
					"torsoXAngle": -0.36476725534516374,
					"torsoYAngle": -0.15650535047681657,
					"footLeftXAngle": 0.6765422689965725,
					"footLeftYAngle": -0.43418789030127947,
					"footRightXAngle": -0.43418789030127947,
					"footRightYAngle": -0.295346620389048
				}
			},
			"pose3": {
				"0": {
					"headXAngle": -0.2259259854329323,
					"headYAngle": 0.32943909421599393,
					"handLeftXAngle": -0.7030383898434498,
					"handLeftYAngle": 0.4076917694544018,
					"handRightXAngle": 0.44240208693245986,
					"handRightYAngle": -0.147673310194524,
					"torsoXAngle": -0.15650535047681657,
					"torsoYAngle": 0.2600184592598782,
					"footLeftXAngle": -0.2259259854329323,
					"footLeftYAngle": 0.5377009990843407,
					"footRightXAngle": 0.46828036412822494,
					"footRightYAngle": 0.12117718934764632
				}
			}
		},
		"closed": false,
		"folders": {}
	}
}

function animate() {
	controls.update();
	// angle from 0 to Pi
	animate.sign = (animate.sign === undefined) ? 1 : animate.sign;
	if (angle < 0 || angle > Math.PI)
	animate.sign *= -1;
	angle += animate.sign*0.01;
	headXFrame.rotation.x = gcontrols.headXAngle;
	headYFrame.rotation.y = gcontrols.headYAngle;
	
	handLXFrame.rotation.z = gcontrols.handLeftXAngle;
	handLYFrame.rotation.y = gcontrols.handLeftYAngle;
	handRXFrame.rotation.z = gcontrols.handRightXAngle;
	handRYFrame.rotation.y = gcontrols.handRightYAngle;
	
	footLXFrame.rotation.x = -gcontrols.footLeftXAngle;
	footLYFrame.rotation.y = gcontrols.footLeftYAngle;
	footRXFrame.rotation.x = -gcontrols.footRightXAngle;
	footRYFrame.rotation.y = gcontrols.footRightYAngle;
	
	torsoXFrame.rotation.x = gcontrols.torsoXAngle;
	torsoYFrame.rotation.y = gcontrols.torsoYAngle;
	
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}