AFRAME.registerComponent('spawn-objects', {
  init() {
    let enemyCount = 2; // Initial number of enemies
    const spawnObjectFn = () => {
      const spawnObjects = document.querySelector('#spawnObject');
      const camerapos = document.querySelector('[camera]').getAttribute('position');

      for (let i = 0; i < enemyCount; i++) {
        const object = document.createElement('a-entity');
        object.setAttribute('gltf-model', '#robot');
        object.setAttribute('scale', '3 3 3');
        object.setAttribute('class', 'enemy');
        object.setAttribute('animation-mixer', {
          clip: 'Running',
          loop: 'repeat',
        });
        //math.random() takes value from 0 - 10 only
        const xpos = (Math.random() - 0.5) * 100;
        const zpos = Math.random() * 100 - 200;
        console.log("zpos: ", zpos);
        object.setAttribute('position', {
          x: xpos,
          y: 0,
          z: zpos,
        });

        //model-loaded is an inbuilt function which is called when the robot is spawned and it says to the console to add the static body to robot// 
        object.addEventListener('model-loaded', () => {
          object.setAttribute('static-body', '');
        });

        spawnObjects.appendChild(object);

        object.setAttribute('animation', {
          property: 'position',
          to: { x: camerapos.x, y: 0, z: 0 },
          dur: 10000,
          easing: 'linear',
        });
     
      }
    };

    const increaseEnemies = () => {
      if (enemyCount < 5) { // Maximum number of enemies
        enemyCount += 2; // Increase enemy count by 2 every 5 seconds
      }
    };

    // Spawn additional enemies every 10 seconds
    const spawnAdditionalEnemies = () => {
      if (enemyCount < 5) { // Maximum number of enemies
        enemyCount += 2; // Increase enemy count by 2 every 10 seconds
        spawnObjectFn(); // Spawn additional enemies
      }
    };

    setInterval(spawnObjectFn, 10000); // Initial spawn
    setInterval(increaseEnemies, 5000); // Increase enemy count every 5 seconds
    setInterval(spawnAdditionalEnemies, 10000); // Spawn additional enemies every 10 seconds
  },
});
  let score = 0

  //Score in the Window//
  function addScore(amount) {
  score += amount
  document.getElementById('scoreText').textContent = `Score : ${score}`
  console.log(score)
  }

  let currentHealth = 100
  
  function reduceHealth(amount) {
    const  Healthelem = document.querySelector('#Health-bar')
  
    currentHealth -= amount;
    if (currentHealth <= 0) {
      currentHealth = 0; // Ensure health doesn't go below 0
      document.getElementById("gameOverPanel").style.display = 'block'
      console.log("Game Over")
    }
    Healthelem.textContent = currentHealth;
  }

AFRAME.registerComponent('collision-listener', {
  init() {
    const {el} = this
    const collisionDetection = (event) => {
      console.log('Collision detected')
      //if statement checks whether there is any class called "enemy"//

      

        // Compare positions and reduce health if they match
        
      if (event.detail.body.el && event.detail.body.el.classList.contains('enemy') === true) {  
        const enemy = event.detail.body.el
        console.log(event.detail.body.el)
        //The below line of code is used to remove the class-"enemy"
        //when the if statement is called
        enemy.removeAttribute('class')
        //Check whether robot is involved in collision//
        console.log("collision with robot");
        
        //Once collision is completed  remove static-body from enemy//
        // enemy.removeAttribute('static-body')
        
        //afteranimation is a function which// 
        //will execute after the robots death animation is finished//
        const afterAnimation = () => {
          enemy.removeEventListener('animation-finished', afterAnimation)
          enemy.setAttribute('visible', false)
        }
        console.log('Enemy removed!')
        
        //Once the animation of the robot is completed//
        //A attribute is used to remove the animation// 
        enemy.removeAttribute('animation-mixer')
        enemy.setAttribute('animation-mixer', {
          clip: 'Death',
          loop: 'once',
        })
        enemy.addEventListener('animation-finished', afterAnimation)
        enemy.addEventListener('animation-finished', () => {
          addScore(10)
          console.log('Enemy removed!')
        })
      }
      else {
         
          //Check whether robot is not involved in collision//
          console.log("collision with other entitites");
      }
    }
    el.addEventListener('collide', collisionDetection)

    const checkcollwithCamera = () => {
      const enemies = document.querySelectorAll('.enemy')
      
      
      for( let i=0; i< enemies.length; i++) {
        const enemyPos = enemies[i].getAttribute('position');
        const cameraposition = document.querySelector('#camera').getAttribute('position');

        if (enemyPos.x === cameraposition.x && enemyPos.y === 0 && enemyPos.z === 0) {
          console.log("Enemy collided with camera");
          reduceHealth(5); // Reduce health by 10 when enemy collides with camera
          
        }

        
      }
      
    }
    setInterval(checkcollwithCamera, 1000);
  },
})

