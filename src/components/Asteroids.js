import React, { useEffect, useState, useRef } from "react";

//THREE FIBER
import { useFrame } from "@react-three/fiber"

//CUSTOM HOOKS
import hooks from "../hooks/Hooks";

const Asteroids = ({ 
        rb3, 
        mb3, 
        rAmp, 
        gAmp, 
        xb1, 
        yb1, 
        zb1, 
        mb1, 
        rb1, 
        setPlanet1Growing, 
        setState, 
        asteroidsQuantity, 
        astMinSize, 
        astMaxSize,
        astSpeed,
        astMinDistance, 
        astMaxDistance,
        selfGravitation
    }) => {

    const selfGravityTweek = 5; 
    const massRate = 1 * Math.pow(10,24) / 40; 
    const astElasticity = 0.5;  


    //RANDOM LOOP
    const [asteroids, setAsteroids] = useState(null);
    const [newAsteroids, setNewAsteroids] = useState(null);
    const [filteredAsteroids, setFilteredAsteroids] = useState([]);
    const [asteroidWithZeroR, setAsteroidWithZeroR] = useState([]);
    //CUSTOM HOOKS
    const {randomRange, gravityFun, sinBFun, cosBFun} = hooks();

    //ASTEROIDS SETTINGS
    //const asteroidQuantity = 500;
    const asteroidSpeed = astSpeed;
    const asteroidMinRadius = astMinSize;
    const asteroidMaxRadius = astMaxSize;
    const asteroidMinLength = rb3 + astMinDistance;
    const asteroidMaxLength = rb3 + astMaxDistance;
    const asteroidZmin = 20;
    const asteroidZmax = -1 * asteroidZmin;
    const asteroidBetaMin = 0;
    const asteroidBetaMax = Math.PI * 2;


    gAmp *= 0.5;
    //console.log(rb1)
    //console.log(mb1)
    //console.log(selfGravitation)
    //console.log(blabal)
    
    //CLASSES FOR RANDOM POSITION
    class Asteroids {
        constructor(ly, lx, asteroidZ, r, vX, vY, index){
            this.x = lx;
            this.y = ly;
            this.z = asteroidZ;
            this.r = r;
            this.m = massRate * r;
            this.vx = vX;
            this.vy = vY;
            this.vz = 0;
            this.index = index;
            this.vxc = 0;
            this.vyc = 0;
            this.vzc = 0;
            this.otherCrashX = 0;
            this.otherCrashY = 0;
            this.otherCrashZ = 0;
        }
        getF(body1m, body2m, body1v, body2v) {
            return ((body1m - body2m) / (body1m + body2m)) * body1v + 
            ((2 * body2m) / (body1m + body2m)) * body2v;
        }
        update(x, y, z, mb1, rb1, selfGrav, thisAsteroids) {
            //GRAVITATION LOOP
            
            //POHYB V GRAVITACNIM POLI SLUNCE
            //vzdalenosti L13 a uhel Beta13
            const Lx13 = 0 - this.x;
            const Ly13 = 0 - this.y;
            const Lz13 = 0 - this.z;
            const Lxy13check = Math.sqrt(Math.pow(Lx13, 2) + Math.pow(Ly13, 2));
            const L13check = Math.sqrt(Math.pow(Lz13, 2) + Math.pow(Lxy13check, 2));
            let L13 = L13check * rAmp;
            const sinB13 = sinBFun(Ly13, L13);
            const cosB13 = cosBFun(Lx13, L13);
            const sinB13z = sinBFun(Lz13, L13);
            //vypocet Gb3 pro Gb1
            const Gb13 = gravityFun(mb3, L13);
            const Gyb13 = sinB13 * Gb13 * gAmp;
            const Gxb13 = cosB13 * Gb13 * gAmp;
            const Gzb13 = sinB13z * Gb13 * gAmp;


            //POHYB V GRAVITACNIM POLI TELESA 2 (zelene)
            const Lx23 = x - this.x;
            const Ly23 = y - this.y;
            const Lz23 = z - this.z;
            const Lxy23check = Math.sqrt(Math.pow(Lx23, 2) + Math.pow(Ly23, 2));
            const L23check = Math.sqrt(Math.pow(Lz23, 2) + Math.pow(Lxy23check, 2));
            let L23 = L23check * rAmp;
            const sinB23 = sinBFun(Ly23, L23);
            const cosB23 = cosBFun(Lx23, L23);
            const sinB23z = sinBFun(Lz23, L23);
            //vypocet Gb3 pro Gb2
            const Gb23 = gravityFun(mb1, L23);
            const Gyb23 = sinB23 * Gb23 * gAmp;
            const Gxb23 = cosB23 * Gb23 * gAmp;
            const Gzb23 = sinB23z * Gb23 * gAmp;        

            

            //POHYB OVLIVNEN OSTATNIMA ASTEROIDAMA
            
            const filteredThisAsteroids = thisAsteroids.filter((item) => item.index !== this.index)
            let AstX = 0;
            let AstY = 0;
            let AstZ = 0;
            
            filteredThisAsteroids.forEach((item) => {

                if(selfGrav === true) {
                    const LxAst = item.x - this.x;
                    const LyAst = item.y - this.y;
                    const LzAst = item.z - this.z;

                    const LxyAstcheck = Math.sqrt(Math.pow(LxAst, 2) + Math.pow(LyAst, 2));
                    const LAstcheck = Math.sqrt(Math.pow(LzAst, 2) + Math.pow(LxyAstcheck, 2));
                    const LAst = LAstcheck * rAmp;

                    //console.log(item)
                    const sinBAst = sinBFun(LyAst, LAst);
                    const cosBAst = cosBFun(LxAst, LAst);
                    const sinBAstz = sinBFun(LzAst, LAst);

                    //vypocet G
                    const GAst = gravityFun(this.m, LAst);
                    const GyAst = sinBAst * GAst * gAmp;
                    const GxAst = cosBAst * GAst * gAmp;
                    const GzAst = sinBAstz * GAst * gAmp;

                    if(LAstcheck < (item.r + this.r + selfGravityTweek)){
                        AstX = 0;
                        AstY = 0;
                        AstZ = 0;
                    }else{
                        AstX += GxAst;
                        AstY += GyAst;
                        AstZ += GzAst;
                    }
                }else{
                    AstX = 0;
                    AstY = 0;
                    AstZ = 0;
                }
            })


            //POHYB PRI KOLIZI S ASTEROIDAMA



            //console.log(AstZ)

            //Ovlivňování vektoru12 gravitaci
            //this.vx += Gxb13 + Gxb23 + AstX;
            //this.vy += Gyb13 + Gyb23 + AstY;
            //this.vz += Gzb13 + Gzb23 + AstZ;
            this.vx += Gxb13 + AstX;
            this.vy += Gyb13 + AstY;
            this.vz += Gzb13 + AstZ;


            //crash
            let crashvX = 0;
            let crashvY = 0;
            let crashvZ = 0;
            
            filteredThisAsteroids.forEach((item) => {
                const rSum = item.r + this.r;
                const lxCheck = item.x - this.x;
                const lyCheck = item.y - this.y;
                const lzCheck = item.z - this.z;
                const Lxycheck = Math.sqrt(Math.pow(lxCheck, 2) + Math.pow(lyCheck, 2));
                const Lzcheck = Math.sqrt(Math.pow(lzCheck, 2) + Math.pow(Lxycheck, 2));
                const L = Lzcheck;
        
                if (L < rSum && !this.isCollision) {        
                    this.isCollision = true;
        
                    // Calculate final velocities for both asteroids
                    const vfx1 = this.getF(this.m, item.m, this.vx, item.vx);
                    const vfy1 = this.getF(this.m, item.m, this.vy, item.vy);
                    const vfz1 = this.getF(this.m, item.m, this.vz, item.vz);
        
                    const vfx2 = this.getF(item.m, this.m, item.vx, this.vx);
                    const vfy2 = this.getF(item.m, this.m, item.vy, this.vy);
                    const vfz2 = this.getF(item.m, this.m, item.vz, this.vz);
        
                    // Apply velocities scaled by elasticity
                    crashvX = vfx1 * astElasticity;
                    crashvY = vfy1 * astElasticity;
                    crashvZ = vfz1 * astElasticity;

                    
        
                    item.otherCrashX = (vfx2 * astElasticity) * -1;
                    item.otherCrashY = (vfy2 * astElasticity) * -1;
                    item.otherCrashZ = (vfz2 * astElasticity) * -1;
                }
        
                if (L > rSum && this.isCollision) {
                    this.isCollision = false;

                }
            });


            
            // If crash to sun
            if(L13check < rb3 + this.r/2){
                this.vx = 0;
                this.vy = 0;
                this.vz = 0;
            } else {
                this.x += this.vx + crashvX + this.otherCrashX;
                this.y += this.vy + crashvY + this.otherCrashY;
                this.z += this.vz + crashvZ + this.otherCrashZ;
            };




            return {
                x: this.x,
                y: this.y,
                z: this.z,
                r: this.r
            }

        }

    }


    
    useEffect(() => {
        const asteroidHandler = [];
        for (let i = 0; i < asteroidsQuantity; i++ ) {
            const rFromSun = randomRange(asteroidMinLength, asteroidMaxLength);
            const asteroidZ = randomRange(asteroidZmin, asteroidZmax);
            const asteroidBeta = randomRange(asteroidBetaMin, asteroidBetaMax);
            const ly = Math.sin(asteroidBeta) * rFromSun;
            const lx = Math.cos(asteroidBeta) * rFromSun;
            const r = randomRange(asteroidMinRadius, asteroidMaxRadius);

            //počateční vector
            const asteroidGama = Math.PI - asteroidBeta;
            const thisSpeed = asteroidSpeed * Math.sqrt(rFromSun / asteroidMinLength);
            const deltaLx = thisSpeed * Math.sin(asteroidGama);
            const deltaLy = thisSpeed * Math.cos(asteroidGama);
            const vX = deltaLx;
            const vY = deltaLy;
            const index = i;

            asteroidHandler.push(new Asteroids(ly, lx, asteroidZ, r, vX, vY, index));
        }
        setAsteroids(asteroidHandler);


    }, [setState])


    async function generateData() {
        const frames = [];
    
        for (let i = 0; i < 1000; i++) {
            const thisFrame = await Promise.all(
                asteroids.map(agent =>
                    Promise.resolve(agent.update(xb1, yb1, zb1, mb1, rb1, selfGravitation, asteroids))
                )
            );
            frames.push(thisFrame);
        }
    
        console.log(frames);
        setNewAsteroids(frames);
        frameRef.current = 0;
    }
    
    /*
    useEffect(() => {
        if(asteroids) {
            generateData()
        }
    }, [asteroids])
    */

    const frameRef = useRef(0);
    
    //ANIMATION
    const [rotationAsteroids, setRotationAsteroids] = useState(true);
    useFrame(() => {
        if(newAsteroids) {
            frameRef.current += 1;
        }
        setRotationAsteroids(!rotationAsteroids)
        asteroids?.forEach(agent =>
            agent.update(xb1, yb1, zb1, mb1, rb1, selfGravitation, asteroids)
        )
    });

    //console.log(asteroids)


    return (
        <>
            {asteroids && (
                <group name="ASTEROIDS" rotation={[0, 0, 0]}>
                    {asteroids.map((asteroid) => {


                        //console.log(asteroid.x)

                        return(
                            <mesh key={randomRange(0, 1000000)} position={[asteroid.x, asteroid.y, asteroid.z]}>
                                <sphereGeometry args={[asteroid.r, 8, 4]} />
                                <meshStandardMaterial args={[{ color: 0xa29890 }]} />
                            </mesh>
                        )
                    })}                
                </group>        
            )}
        </>
    )
};

export default Asteroids;