//Remember to create my gsap
//add enemies that shoot
//add powerups (health, missiles, shield, increase bullet rate )
//


// import {tst} from "./likelier_value_algo.js";
// import {tst2} from "./fire_rate_randomizer.js";

const canvas = document.getElementById("mycanvas");
const ctx = canvas.getContext("2d");
const friction = 0.99;
let spawn;
let plyrfirerate = 200;
document.addEventListener('mousemove', upmousecor);
// document.addEventListener('touch', upmousecor);
let mouse_y;
let mouse_x;


let animid;
let g_ov = false;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


class Player {
    constructor(x, y, radius, color, plrydmg, life, hp) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.plrydmg = plrydmg;
        this.hp = hp;
        this.life = life;
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 360)
        ctx.fillStyle = this.color
        ctx.fill()
    }

    update() {
        this.draw();
        if ((player.hp * 2 <= 300) && (player.hp * 2 > 200)) {
            player.life = 3;
        }
        if ((player.hp * 2 <= 200) && (player.hp * 2 > 100)) {
            player.life = 2;
        }
        if ((player.hp * 2 <= 100) && (player.hp * 2 > 0)) {
            player.life = 1;
        }
        if (player.hp * 2 <= 0) {
            player.life = 0;
        }
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 360)
        ctx.fillStyle = this.color
        ctx.fill()
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity, hp, enemdmg, fires, firerate) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.hp = hp;
        this.enemdmg = enemdmg;
        this.fires = fires;
        this.firerate = firerate;
        this.vee = true;
        this.plap = undefined;
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 360)
        ctx.fillStyle = this.color
        ctx.fill()
    }

    shoot() {
        if (this.fires) {
            console.log(this.firerate);
            const angle = Math.atan2(
                player.y - this.y,
                player.x - this.x
            );
            const velocity = {
                x: Math.cos(angle) * 5,
                y: Math.sin(angle) * 5
            };
            enemprojectiles.push(new Projectile(
                this.x,
                this.y,
                5,
                this.color,
                velocity
            ));

            if (this.hp <= 0) {
                clearTimeout(this.plap);
            }
            if (this.hp > 0) {
                this.plap = setTimeout(() => {
                    this.shoot()
                }, this.firerate);
            }
            this.vee = false;
        }
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }

    draw() {
        ctx.save()
        ctx.globalAlpha = this.alpha;
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 360)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.restore()
    }

    update() {
        this.draw();
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01
    }
}

const x = canvas.width / 2;
const y = canvas.height / 2;

const player = new Player(x, y, 10, 'white', 5, 1, 150);
const projectiles = [];
const enemprojectiles = [];
const enemies = [];
const particles = [];

function upmousecor(event) {
    mouse_x = event.clientX;
    mouse_y = event.clientY;
}

function newproje() {
    const angle = Math.atan2(
        mouse_y - y,
        mouse_x - x
    );
    const velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
    };
    projectiles.push(new Projectile(
        x,
        y,
        5,
        'white',
        velocity
    ));
    if (g_ov === false) {
        setTimeout(newproje, plyrfirerate);
    }
}


function animate() {
    animid = requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    particles.forEach((particle, index) => {
            if (particle.alpha <= 0) {
                particles.splice(index, 1)
            } else {
                particle.update();
            }
        }
    )
    projectiles.forEach((projectile, index) => {
        projectile.update()
        if (
            projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height
        ) {
            setTimeout(() => {
                projectiles.splice(index, 1);
            }, 0)
        }
    });
    enemprojectiles.forEach((projectile, index) => {
        projectile.update()
        if (
            projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height
        ) {
            setTimeout(() => {
                enemprojectiles.splice(index, 1);
            }, 0)
        }
    });
    enemprojectiles.forEach((enemproj, index) => {
        projectiles.forEach((projectile, projectileindex) => {
            const dist = Math.hypot(projectile.x - enemproj.x, projectile.y - enemproj.y);

            if (dist - enemproj.radius - projectile.radius < 1) {
                for (let i = 0; i < enemproj.radius; i++) {
                    particles.push(new Particle(enemproj.x, enemproj.y, Math.random() * 2, 'white', {
                            x: (Math.random() - 0.5) * (Math.random() * 4),
                            y: (Math.random() - 0.5) * (Math.random() * 4)
                        })
                    )
                }

                setTimeout(() => {
                    enemprojectiles.splice(index, 1);
                    projectiles.splice(projectileindex, 1);
                }, 0)
            }
        })
    })

    enemies.forEach((enemy, index) => {
        enemy.update();
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);//could add the radii here for col_de
        if (player.hp <= 0) {
            g_ov = true;
            cancelAnimationFrame(animid);
            clearInterval(spawn);
        }

        if (dist - enemy.radius - player.radius < 1) {
            player.hp -= enemy.hp;
            enemy.hp = 0;
            setTimeout(() => {
                enemies.splice(index, 1);
            }, 0);
        }

        projectiles.forEach((projectile, projectileindex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);//could add the radii here for col_de

            if (dist - enemy.radius - projectile.radius < 1) {
                for (let i = 0; i < enemy.radius; i++) {
                    particles.push(new Particle(projectile.x, projectile.y, Math.random() * 2, `hsl(${Math.floor(Math.random() * 360)},50%,50%)`, {
                            x: (Math.random() - 0.5) * (Math.random() * 8),
                            y: (Math.random() - 0.5) * (Math.random() * 8)
                        })
                    )
                }
                enemy.hp -= player.plrydmg;
                if (enemy.hp > 0) {
                    if (enemy.radius - player.plrydmg >= 5) {
                        gsap.to(enemy, {
                            radius: enemy.radius - player.plrydmg
                        })

                        setTimeout(() => {
                            projectiles.splice(projectileindex, 1);
                        }, 0)

                    }
                } else {
                    setTimeout(() => {
                        enemies.splice(index, 1);
                        projectiles.splice(projectileindex, 1);
                    }, 0)
                }
            }
        })
    });
}


function spawnenemies() {
    spawn = setInterval(() => {
        const radius = Math.floor((Math.random() * 27) + 4);
        const hp = radius + Math.floor((Math.random() * 10) + 10);
        let X;
        let Y;
        let fires = false;
        let dmg = 0;
        const detfir = () => {
            return Math.ceil(Math.random() * 5)
        }
        detfir();
        if (detfir() === 5) {
            fires = true;
        }

        if (Math.random() < 0.5) {
            Y = Math.random() * canvas.height;
            X = Math.random() < .5 ? 0 - radius : canvas.height + radius;
        } else {
            X = Math.random() * canvas.width;
            Y = Math.random() < .5 ? 0 - radius : canvas.width + radius;
        }

        if (fires === true) {
            dmg = tst();
        }

        let firrate = tst2();

        if (dmg > 5) {
            firrate -= 100;
        }

        const color = `hsl(${Math.floor(Math.random() * 360)},50%,50%)`;
        const angle = Math.atan2(
            y - Y,
            x - X
        );
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        if (fires) {
            enemies.push(new Enemy(X, Y, radius, color, velocity, hp, dmg, fires, firrate))
            enemies.forEach((enemy) => {
                if (enemy.vee === true) {
                    console.log('yes')
                    enemy.shoot();

                }
            })
        }
    }, 1000)
}

//
// function shoot() {
//     if (this.fires) {
//         console.log(this.firerate);
//         const angle = Math.atan2(
//             player.y - this.y,
//             player.x - this.x
//         );
//         const velocity = {
//             x: Math.cos(angle) * 5,
//             y: Math.sin(angle) * 5
//         };
//         enemprojectiles.push(new Projectile(
//             this.x,
//             this.y,
//             5,
//             this.color,
//             velocity
//         ));
//
//         console.log(enemprojectiles);
//         setTimeout(shoot, this.firerate);
//         this.vee = false;
//     }
// }

// function plrhpud() {
//     switch (player.life) {
//         case (player.hp <= 300) && (player.hp > 200) :
//             player.life = 3;
//             break
//         case (player.hp <= 200) && (player.hp > 100):
//             player.life = 2;
//             break
//         case (player.hp <= 100) && (player.hp > 0):
//             player.life = 1;
//             break
//         case player.hp <= 0:
//             player.life = 0;
//             break
//         default:
//             player.life = 3;
//     }
// }

spawnenemies();
animate();
newproje();


//TODO: CREATE AN ARRAY of different powerups and a randomizer which picks random items at random intervals and depending on the item picked, sets building block variables and calls different functions and draws the powerup
//TODO: create a function that makes 1 in 5 enemies fire bullets, recreate enem bullet firing , work on bullet to bullet collisions, work on player health which will be equal to 100hp each work on health display, bullets subtract health, randomize enem firerate and damage
//TODO: work on player movement



