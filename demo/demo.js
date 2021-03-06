 var glContext;
    
        function initGL(canvas){
            try{
                glContext = canvas.getContext("experimental-webgl");
                glContext.viewportWidth = canvas.width;
                glContext.viewportHeight = canvas.height;
            } catch(e) {
                
            }
            
            if(!glContext) {
                alert("Failed to initialize WebGL (Failed to get context)");
            }
        }
        
        function getShader(glContext, id){
            var shaderScript = document.getElementById(id);
            if(!shaderScript){
                return null;
            }
            
            var str = "";
            var k = shaderScript.firstChild;
            while(k){
                if(k.nodeType == 3){
                    str += k.textContent;
                }
                k = k.nextSibling;
            }
            
            var shader;
            if(shaderScript.type == "x-shader/x-fragment"){
                shader = glContext.createShader(glContext.FRAGMENT_SHADER);
            } else if(shaderScript.type == "x-shader/x-vertex"){
                shader = glContext.createShader(glContext.VERTEX_SHADER);
            } else {
                return null;
            }
            
            glContext.shaderSource(shader, str);
            glContext.compileShader(shader);
            
            if(!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)){
                alert(glContext.getShaderInfoLog(shader));
                return null;
            }
            
            return shader;
        }
        
        var shaderProgram;
        
        function initShaders(){
            //var fragmentShader = getShader(glContext, "shader-fs");
            var fragmentShader = get_demo_fragment_shader();
            //var vertexShader = getShader(glContext, "shader-vs");
            var vertexShader = get_demo_vertex_shader();
            
            shaderProgram = glContext.createProgram();
            glContext.attachShader(shaderProgram, fragmentShader);
            glContext.attachShader(shaderProgram, vertexShader);
            glContext.linkProgram(shaderProgram);
            
            if(!glContext.getProgramParameter(shaderProgram, glContext.LINK_STATUS)){
                alert("Could not initialize shaders!");
            }
            
            glContext.useProgram(shaderProgram);
            
            shaderProgram.vertexPositionAttribute = glContext.getAttribLocation(shaderProgram, "aVertexPosition");
            glContext.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
            
            shaderProgram.textureCoordAttribute = glContext.getAttribLocation(shaderProgram, "aTextureCoordinates");
            glContext.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
            
            shaderProgram.pMatrixUniform = glContext.getUniformLocation(shaderProgram, "uPMatrix");
            shaderProgram.mvMatrixUniform = glContext.getUniformLocation(shaderProgram, "uMVMatrix");
            shaderProgram.samplerUniform = glContext.getUniformLocation(shaderProgram, "uSampler");
        }
        
        //var mesh = new obj_loader.Mesh( "School_Chair.obj" );
        var cubeVertexPositionBuffer;
        var cubeVertexTextureCoordinatesBuffer;
        var cubeVertexIndexBuffer;
        
        var worldVertexPositionBuffer;
        var worldVertexTextureCoordinatesBuffer;
        var worldVertexIndexBuffer;
        
        function initBuffers(){
            
            cubeVertexPositionBuffer = glContext.createBuffer();
            glContext.bindBuffer(glContext.ARRAY_BUFFER, cubeVertexPositionBuffer);
            
            var vertices = [
                // Front face
               -1.0, -1.0,  1.0,
                1.0, -1.0,  1.0,
                1.0,  1.0,  1.0,
               -1.0,  1.0,  1.0,

                // Back face
               -1.0, -1.0, -1.0,
               -1.0,  1.0, -1.0,
                1.0,  1.0, -1.0,
                1.0, -1.0, -1.0,

                // Top face
               -1.0,  1.0, -1.0,
               -1.0,  1.0,  1.0,
                1.0,  1.0,  1.0,
                1.0,  1.0, -1.0,

                // Bottom face
               -1.0, -1.0, -1.0,
                1.0, -1.0, -1.0,
                1.0, -1.0,  1.0,
               -1.0, -1.0,  1.0,

                // Right face
                1.0, -1.0, -1.0,
                1.0,  1.0, -1.0,
                1.0,  1.0,  1.0,
                1.0, -1.0,  1.0,

                // Left face
               -1.0, -1.0, -1.0,
               -1.0, -1.0,  1.0,
               -1.0,  1.0,  1.0,
               -1.0,  1.0, -1.0
            ];
            
            glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(vertices), glContext.STATIC_DRAW);
            cubeVertexPositionBuffer.itemSize = 3;
            cubeVertexPositionBuffer.numItems = 24;
                
            cubeVertexTextureCoordinatesBuffer = glContext.createBuffer();
            glContext.bindBuffer(glContext.ARRAY_BUFFER, cubeVertexTextureCoordinatesBuffer);
            var textureCoordinates = [
              // Front face
              0.0, 0.0,
              1.0, 0.0,
              1.0, 1.0,
              0.0, 1.0,

              // Back face
              1.0, 0.0,
              1.0, 1.0,
              0.0, 1.0,
              0.0, 0.0,

              // Top face
              0.0, 1.0,
              0.0, 0.0,
              1.0, 0.0,
              1.0, 1.0,

              // Bottom face
              1.0, 1.0,
              0.0, 1.0,
              0.0, 0.0,
              1.0, 0.0,

              // Right face
              1.0, 0.0,
              1.0, 1.0,
              0.0, 1.0,
              0.0, 0.0,

              // Left face
              0.0, 0.0,
              1.0, 0.0,
              1.0, 1.0,
              0.0, 1.0,
            ];
            glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(textureCoordinates), glContext.STATIC_DRAW);
            cubeVertexTextureCoordinatesBuffer.itemSize = 2;
            cubeVertexTextureCoordinatesBuffer.numItems = 4;
            
            cubeVertexIndexBuffer = glContext.createBuffer();
            glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
            var cubeVertexIndices = [
                0, 1, 2,      0, 2, 3,    // Front face
                4, 5, 6,      4, 6, 7,    // Back face
                8, 9, 10,     8, 10, 11,  // Top face
                12, 13, 14,   12, 14, 15, // Bottom face
                16, 17, 18,   16, 18, 19, // Right face
                20, 21, 22,   20, 22, 23  // Left face
            ];
            
            glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), glContext.STATIC_DRAW);
            cubeVertexIndexBuffer.itemSize = 1;
            cubeVertexIndexBuffer.numItems = 36;
            
            
            worldVertexPositionBuffer = glContext.createBuffer();
            glContext.bindBuffer(glContext.ARRAY_BUFFER, worldVertexPositionBuffer);
            var vertices = [
                
                // NUMPOLLIES 36

                // Floor 
                -9.0,  0.0, -9.0,
                -9.0,  0.0,  9.0,
                 9.0,  0.0,  9.0,

                -9.0,  0.0, -9.0,
                 9.0,  0.0, -9.0,
                 9.0,  0.0,  9.0,
                 
                 // Top
                -9.0,  5.0, -9.0,
                -9.0,  5.0,  9.0,
                 9.0,  5.0,  9.0,

                -9.0,  5.0, -9.0,
                 9.0,  5.0, -9.0,
                 9.0,  5.0,  9.0,
                 
                 // F1
                 -9.0, 0.0, -9.0,
                 -9.0, 5.0, -9.0,
                 -9.0, 0.0, 9.0,
                 
                 -9.0, 0.0, 9.0,
                 -9.0, 5.0, 9.0,
                 -9.0, 5.0, -9.0,
                 
                 // f2
                 -9.0, 0.0, -9.0,
                 -9.0, 5.0, -9.0,
                 9.0, 0.0, -9.0,
                 
                 -9.0, 5.0, -9.0,
                 9.0, 5.0, -9.0,
                 9.0, 0.0, -9.0,
                 
                  // f3
                 9.0, 0.0, -9.0,
                 9.0, 5.0, -9.0,
                 9.0, 0.0, 9.0,
                 
                 9.0, 5.0, -9.0,
                 9.0, 5.0, 9.0,
                 9.0, 0.0, 9.0,
                 
                 // f4
                 9.0, 0.0, 9.0,
                 9.0, 5.0, 9.0,
                 -9.0, 5.0, 9.0,
                 
                 9.0, 0.0, 9.0,
                 -9.0, 0.0, 9.0,
                 -9.0, 5.0, 9.0,
            ];
            
            glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(vertices), glContext.STATIC_DRAW);
            worldVertexPositionBuffer.itemSize = 3;
            worldVertexPositionBuffer.numItems = 36;
            
            worldVertexTextureCoordinatesBuffer = glContext.createBuffer();
            glContext.bindBuffer(glContext.ARRAY_BUFFER, worldVertexTextureCoordinatesBuffer);
            
            var textureCoordinates = [
                //floor
                0.0, 18.0,
                0.0, 0.0,
                18.0, 0.0,
                
                0.0, 18.0,
                18.0, 18.0,
                18.0, 0.0,
                //top
                0.0, 18.0,
                0.0, 0.0,
                18.0, 0.0,
                
                0.0, 18.0,
                18.0, 18.0,
                18.0, 0.0,
                //f1
                
                0.0, 0.0,
                18.0, 0.0,
                0.0, 18.0,
                
                0.0, 0.0,
                0.0, 18.0,                
                18.0, 18.0,
                
                                
                
                
                
                
                
                //f2
                0.0, 0.0,
                18.0, 0.0,
                0.0, 18.0,
                
                0.0, 0.0,
                0.0, 18.0,                
                18.0, 18.0,
                
                //f3
                0.0, 0.0,
                18.0, 0.0,
                0.0, 18.0,
                
                0.0, 0.0,
                0.0, 18.0,                
                18.0, 18.0,
                
                //f4
                0.0, 0.0,
                18.0, 0.0,
                0.0, 18.0,
                
                0.0, 0.0,
                0.0, 18.0,                
                18.0, 18.0,
            ];
            
            glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(textureCoordinates), glContext.STATIC_DRAW);
            worldVertexTextureCoordinatesBuffer.itemSize = 2;
            worldVertexTextureCoordinatesBuffer.numItems = 36;
            
            worldVertexIndexBuffer = glContext.createBuffer();
            glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, worldVertexIndexBuffer);
            var worldVertexIndices = [
                0, 1, 2,      3, 4, 5,
                6, 7 ,8,      9, 10, 11,
                12, 13, 14,   15, 16, 17,
                18, 19, 20,   21, 22, 23,
                24, 25, 26,   27, 28, 29,
                30, 31, 32,   33, 34, 35,
            ];
            
            glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(worldVertexIndices), glContext.STATIC_DRAW);
            worldVertexIndexBuffer.itemSize = 1;
            worldVertexIndexBuffer.numItems = 36;
        }
        
        var mvMatrix = mat4.create();
        var pMatrix = mat4.create();
        
        function setMatrixUniforms(){
            glContext.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
            glContext.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
        }
        
        var mvMatrixStack = [];
        
        function mvPushMatrix(){
            var copy = mat4.create();
            mat4.set(mvMatrix, copy);
            mvMatrixStack.push(copy);
        }
        
        function mvPopMatrix(){
            if(mvMatrixStack.length == 0){
                throw "Invalid popMatrix!";
            }
            mvMatrix = mvMatrixStack.pop();
        }
        
        function degreesToRadians(degrees){
            return degrees * Math.PI / 180;
        }
        
        var xRotation = 20;
        var xSpeed = 0;
        var yRotation = 20;
        var ySpeed = 0;
        
        var z = -5.0;
        var filter = 0;
        
        var currentlyPressedKeys = {};
        
        function handleKeyDown(event){
            currentlyPressedKeys[event.keyCode] = true;
            
            if(String.fromCharCode(event.keyCode) == "F"){
                filter += 1;
                if(filter == 3){
                    filter = 0;
                }
            }
        }
        
        function handleKeyUp(event){
            currentlyPressedKeys[event.keyCode] = false;
        }
        
        var pitch = 0;
        var pitchRate = 0;
        var yaw = 0;
        var yawRate = 0;
        var xPos = 0;
        var yPos = 0.4;
        var zPos =0;
        var speed = 0;
        
        function handleKeys(){
            if (currentlyPressedKeys[33]) {
            // Page Up
            z -= 0.05;
            }
            if (currentlyPressedKeys[34]) {
                // Page Down
                z += 0.05;
            }
            if (currentlyPressedKeys[37]) {
                // Left cursor key
                ySpeed -= 1;
            }
            if (currentlyPressedKeys[39]) {
                // Right cursor key
                ySpeed += 1;
            }
            if (currentlyPressedKeys[38]) {
                // Up cursor key
                xSpeed -= 1;
            }
            if (currentlyPressedKeys[40]) {
                // Down cursor key
                xSpeed += 1;
            }
            
            
            
             if (currentlyPressedKeys[81]) {
                // Q
                pitchRate = 0.1;
            } else if (currentlyPressedKeys[69]) {
                // U
                pitchRate = -0.1;
            } else {
                pitchRate = 0;
            }
            
            if (currentlyPressedKeys[65]) {
            // A
            yawRate = 0.1;
            } else if (currentlyPressedKeys[68]) {
                // D
                yawRate = -0.1;
            } else {
                yawRate = 0;
            }

            if (currentlyPressedKeys[87]) {
                // W
                speed = 0.003;
            } else if (currentlyPressedKeys[83]) {
                // S
                speed = -0.003;
            } else {
                speed = 0;
            }
        }
        
        var radiansTriangle = 0;
        var radiansSquare = 0;
        
        function draw(){
            updateTexture();
            glContext.viewport(0, 0, glContext.viewportWidth, glContext.viewportHeight);
            glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
            
            mat4.perspective(45, glContext.viewportWidth / glContext.viewportHeight, 0.1, 100.0, pMatrix);
            
            mat4.identity(mvMatrix);
            

            mat4.rotate(mvMatrix, degreesToRadians(-pitch), [1, 0, 0]);
            mat4.rotate(mvMatrix, degreesToRadians(-yaw), [0, 1, 0]);
            mat4.translate(mvMatrix, [-xPos, -yPos, -zPos]);
            
            mat4.translate(mvMatrix, [0.0, 0.0, z]);
            
            mvPushMatrix();
            mat4.translate(mvMatrix, [0.0, 1.8, 0.0]);
            mat4.rotate(mvMatrix, degreesToRadians(xRotation), [1, 0, 0]);
            mat4.rotate(mvMatrix, degreesToRadians(yRotation), [0, 1, 0]);
            
                       
            glContext.bindBuffer(glContext.ARRAY_BUFFER, cubeVertexPositionBuffer);
            glContext.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, glContext.FLOAT, false, 0, 0);
            
            glContext.bindBuffer(glContext.ARRAY_BUFFER, cubeVertexTextureCoordinatesBuffer);
            glContext.vertexAttribPointer(shaderProgram.textureCoordAttribute, cubeVertexTextureCoordinatesBuffer.itemSize, glContext.FLOAT, false, 0, 0);
            
            glContext.activeTexture(glContext.TEXTURE0);
            //glContext.bindTexture(glContext.TEXTURE_2D, crateTextures[filter]);
            glContext.bindTexture(glContext.TEXTURE_2D, cubeTexture);
            glContext.uniform1i(shaderProgram.samplerUniform, 0);
            
            glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
            setMatrixUniforms();
            //glContext.drawElements(glContext.TRIANGLES, cubeVertexIndexBuffer.numItems, glContext.UNSIGNED_SHORT, 0);
            glContext.drawElements(glContext.TRIANGLES, 6, glContext.UNSIGNED_SHORT, 0);
            
            glContext.bindTexture(glContext.TEXTURE_2D, crateTextures[0]);
            //glContext.uniform1i(shaderProgram.samplerUniform, 0);
            glContext.bindTexture(glContext.TEXTURE_2D, crateTextures[3]);
            glContext.drawElements(glContext.TRIANGLES, 6, glContext.UNSIGNED_SHORT, 12);
            
            //glContext.bindTexture(glContext.TEXTURE_2D, crateTextures[0]);
            //glContext.drawElements(glContext.TRIANGLES, 6, glContext.UNSIGNED_SHORT, 24);
            
            glContext.bindTexture(glContext.TEXTURE_2D, crateTextures[0]);
            //glContext.drawElements(glContext.TRIANGLES, 6, glContext.UNSIGNED_SHORT, 36);
            //glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
            //setMatrixUniforms();
            //glContext.drawElements(glContext.TRIANGLES, cubeVertexIndexBuffer.numItems, glContext.UNSIGNED_SHORT, 0);
            glContext.drawElements(glContext.TRIANGLES, cubeVertexIndexBuffer.numItems - 12, glContext.UNSIGNED_SHORT, 24);
            
            mvPopMatrix();
            
            
            mat4.translate(mvMatrix, [0.0, 0.0, 0.0]);

            mvPushMatrix();

            glContext.bindBuffer(glContext.ARRAY_BUFFER, worldVertexPositionBuffer);
            glContext.vertexAttribPointer(shaderProgram.vertexPositionAttribute, worldVertexPositionBuffer.itemSize, glContext.FLOAT, false, 0, 0);
            
            glContext.bindBuffer(glContext.ARRAY_BUFFER, worldVertexTextureCoordinatesBuffer);
            glContext.vertexAttribPointer(shaderProgram.textureCoordAttribute, worldVertexTextureCoordinatesBuffer.itemSize, glContext.FLOAT, false, 0, 0);
            
            glContext.activeTexture(glContext.TEXTURE0);
            glContext.bindTexture(glContext.TEXTURE_2D, crateTextures[1]);
            glContext.uniform1i(shaderProgram.samplerUniform, 0);
            
            glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, worldVertexIndexBuffer);
            setMatrixUniforms();
            //glContext.drawElements(glContext.TRIANGLES, worldVertexIndexBuffer.numItems, glContext.UNSIGNED_SHORT, 0);
            
            glContext.drawElements(glContext.TRIANGLES, 12, glContext.UNSIGNED_SHORT, 0);
            
            //glContext.bindTexture(glContext.TEXTURE_2D, crateTextures[3]);
            //glContext.drawElements(glContext.TRIANGLES, 6, glContext.UNSIGNED_SHORT, 24);
            
            glContext.bindTexture(glContext.TEXTURE_2D, crateTextures[2]);
            glContext.drawElements(glContext.TRIANGLES, cubeVertexIndexBuffer.numItems - 12, glContext.UNSIGNED_SHORT, 24);
            
            mvPopMatrix();

        }
        
        var videoElement;
        var cubeTexture;
        
        function updateTexture() {
            glContext.bindTexture(glContext.TEXTURE_2D, cubeTexture);
            glContext.pixelStorei(glContext.UNPACK_FLIP_Y_WEBGL, true);
            glContext.texImage2D(glContext.TEXTURE_2D, 0, glContext.RGBA, glContext.RGBA,
            glContext.UNSIGNED_BYTE, videoElement);
        }
        
        function tick(){
            requestAnimFrame(tick);
            handleKeys();
            draw();
            animate();
        }
        
        function startVideo() {
            videoElement.play();
            setInterval(draw, 15);
        }
        
        function videoDone(){
        }
        
        var lastTime = 0;
        
        var joggingAngle = 0;
        
        function animate(){
            var timeNow = new Date().getTime();
            if(lastTime != 0){
                var elapsed = timeNow - lastTime;
                
                xRotation += (xSpeed * elapsed) / 1000.0;
                yRotation += (ySpeed * elapsed) / 1000.0;
                
                if(speed != 0) {
                    xPos -= Math.sin(degreesToRadians(yaw)) * speed * elapsed;
                    zPos -= Math.cos(degreesToRadians(yaw)) * speed * elapsed;
                    
                    joggingAngle += elapsed * 0.6;
                    yPos = Math.sin(degreesToRadians(joggingAngle)) / 20 + 0.4;
                }
                yaw += yawRate * elapsed;
                pitch += pitchRate * elapsed;
            }
            lastTime = timeNow;
        }
        
        function handleLoadedTexture(textures){
            /*glContext.pixelStorei(glContext.UNPACK_FLIP_Y_WEBGL, true);

            glContext.bindTexture(glContext.TEXTURE_2D, textures[0]);
            glContext.texImage2D(glContext.TEXTURE_2D, 0, glContext.RGBA, glContext.RGBA, glContext.UNSIGNED_BYTE, textures[0].image);
            glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.NEAREST);
            glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.NEAREST);

            glContext.bindTexture(glContext.TEXTURE_2D, textures[1]);
            glContext.texImage2D(glContext.TEXTURE_2D, 0, glContext.RGBA, glContext.RGBA, glContext.UNSIGNED_BYTE, textures[1].image);
            glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.LINEAR);
            glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.LINEAR);

            glContext.bindTexture(glContext.TEXTURE_2D, textures[2]);
            glContext.texImage2D(glContext.TEXTURE_2D, 0, glContext.RGBA, glContext.RGBA, glContext.UNSIGNED_BYTE, textures[2].image);
            glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.LINEAR);
            glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.LINEAR_MIPMAP_NEAREST);
            glContext.generateMipmap(glContext.TEXTURE_2D);

            glContext.bindTexture(glContext.TEXTURE_2D, null);*/
            cubeTexture = glContext.createTexture();
            glContext.bindTexture(glContext.TEXTURE_2D, cubeTexture);
            glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.LINEAR);
            glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.LINEAR);
            glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_S, glContext.CLAMP_TO_EDGE);
            glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_T, glContext.CLAMP_TO_EDGE);
            
            glContext.bindTexture(glContext.TEXTURE_2D, textures[0]);
            glContext.texImage2D(glContext.TEXTURE_2D, 0, glContext.RGBA, glContext.RGBA, glContext.UNSIGNED_BYTE, textures[0].image);
            glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.LINEAR);
            glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.LINEAR_MIPMAP_NEAREST);
            glContext.generateMipmap(glContext.TEXTURE_2D);
            
            glContext.bindTexture(glContext.TEXTURE_2D, textures[1]);
            glContext.texImage2D(glContext.TEXTURE_2D, 0, glContext.RGBA, glContext.RGBA, glContext.UNSIGNED_BYTE, textures[1].image);
            glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.LINEAR);
            glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.LINEAR_MIPMAP_NEAREST);
            glContext.generateMipmap(glContext.TEXTURE_2D);
            
            
            glContext.bindTexture(glContext.TEXTURE_2D, textures[2]);
            glContext.texImage2D(glContext.TEXTURE_2D, 0, glContext.RGBA, glContext.RGBA, glContext.UNSIGNED_BYTE, textures[2].image);
            glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.LINEAR);
            glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.LINEAR_MIPMAP_NEAREST);
            glContext.generateMipmap(glContext.TEXTURE_2D);
            
            glContext.bindTexture(glContext.TEXTURE_2D, textures[3]);
            glContext.texImage2D(glContext.TEXTURE_2D, 0, glContext.RGBA, glContext.RGBA, glContext.UNSIGNED_BYTE, textures[3].image);
            glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.LINEAR);
            glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.LINEAR_MIPMAP_NEAREST);
            glContext.generateMipmap(glContext.TEXTURE_2D);
            
        }
        
        var crateTextures = new Array();
        
        function initTexture(){
            var crateImage = new Image();
            
            for(var i=0; i<4; i++){
                var texture = glContext.createTexture();
                texture.image = crateImage;
                crateTextures.push(texture);
            }
            
            var text = glContext.createTexture();
            var image = new Image();
            text.image = image;
            crateTextures[1] = text;
            
            var text2 = glContext.createTexture();
            var image2 = new Image();
            text2.image = image2;
            crateTextures[2] = text2;
            
            var text3 = glContext.createTexture();
            var image3 = new Image();
            text3.image = image3;
            crateTextures[3] = text3;
            
            crateImage.onload = function(){
                handleLoadedTexture(crateTextures);
            }
            
            //crateImage.src = "crate.gif";
            crateImage.src = "images/fle1.jpeg";
            //crateImage.src = "rock.jpg"
            
            image.src = "images/wood3.jpg";
            image2.src = "images/rock.jpg";
            //image2.src = "kawallrr.jpg";
            image3.src = "images/kawallrr.jpg";
            
        }
    
        function webGLStart(){
            videoElement = document.getElementById("video");
            
            
            var canvas = document.getElementById("screen");
            initGL(canvas);
            initShaders();
            initBuffers();
            initTexture();
            
            videoElement.addEventListener("canplaythrough", startVideo, true);
            videoElement.addEventListener("ended", videoDone, true);
            
            glContext.clearColor(0.0, 0.0, 0.0, 1.0);
            glContext.enable(glContext.DEPTH_TEST);
            
            document.onkeydown = handleKeyDown;
            document.onkeyup = handleKeyUp;
            videoElement.preload = "auto";
            //videoElement.src = "videos/test.ogv";
            videoElement.src = "videos/baaa.ogv";
            //videoElement.src = "http://www.youtube.com/embed/8Af372EQLck?enablejsapi=1&version=3&playerapiid=ytplayer";
            
            tick();
        }