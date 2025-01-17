# 3D Reconstruction of one room
This repository contains the codebase of web application, which uses the *3D reconstruction* model (DUSt3R) for rendering indoor scenes. Since DUSt3R performs *3D reconstruction* of 2D images without camera parameters, an indoor 3D reconstruction application was developed with only image information crawled from the web.  
For more information on DUSt3R, please check the address[https://github.com/naver/dust3r].

## Getting Started
### Installation
1. Clone repository
 ```
 git clone https://github.com/Soooo-hong/3DReconstruction_of_one_room.git
 ```
2. Create the environment, here we show an example using conda
```
conda create -n onerm python=3.11 
conda activate onerm
pip install -r requirements.txt
```

### Web Demo
```
python web/backend/app.py 
```
Hit "Run" and wait. Then, you can click the address 'http://127.0.0.1:5000' in your terminal. 

### Page

## Reuslt
### 3D Rendring of Scnenes
![demo_vid (online-video-cutter com)](https://github.com/user-attachments/assets/1dfad6ea-15fa-49c3-8124-bf91f196946a)



## Members
|멤버이름|역할|
|------|---|
|김수홍|Leader, Training model, Frontend, Backend|
|김지수|Merging 3D Scenes |
|이민석|Crawling, 3D Rendering|

### Tools
![JS](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white) ![js](https://img.shields.io/badge/HTML-239120?style=for-the-badge&logo=html5&logoColor=white) ![js](https://img.shields.io/badge/CSS-239120?&style=for-the-badge&logo=css3&logoColor=white) ![js](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white) ![js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white) ![js](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)




