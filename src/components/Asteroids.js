import React, { useEffect, useState } from "react";

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


    //RANDOM LOOP
    const [asteroids, setAsteroids] = useState([]);
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
            this.vx = vX;
            this.vy = vY;
            this.vz = 0;
            this.index = index;
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


            //POHYB V GRAVITACNIM POLI TELESA 2
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
            const massRate = 1 * Math.pow(10,24) / 10;
            const thisM = massRate * this.r;

            const filteredThisAsteroids = thisAsteroids.filter((item) => item.x != this.x)
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
                    const GAst = gravityFun(thisM, LAst);
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
            //console.log(AstZ)

            //Ovlivňování vektoru12 gravitaci
            //this.vx += Gxb13 + Gxb23 + AstX;
            //this.vy += Gyb13 + Gyb23 + AstY;
            //this.vz += Gzb13 + Gzb23 + AstZ;

            this.vx += Gxb13 + AstX;
            this.vy += Gyb13 + AstY;
            this.vz += Gzb13 + AstZ;
            

            if(L13check < rb3 + this.r/2){
                this.vx = 0;
                this.vy = 0;
                this.vz = 0;

            }
            else if(L23check < rb1 - this.r/4){
                this.r = 0;
            }

            else{
            //hlavní pohyb bodu 1

                //if srazka

                let srazkyX = 0;
                let srazkyY = 0;
                let srazkyZ = 0;
                filteredThisAsteroids.forEach((item) => {

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
                    const GAst = gravityFun(thisM, LAst);
                    const GyAst = sinBAst * GAst * gAmp;
                    const GxAst = cosBAst * GAst * gAmp;
                    const GzAst = sinBAstz * GAst * gAmp;

                    if(LAstcheck < (item.r + this.r)){
                        //console.log(item.vx)
                        srazkyX += item.vx;
                        srazkyY += item.vy;
                        srazkyZ += item.vz; 

                    }else{

                    }
                })

                /*
                this.x += this.vx + srazkyX
                this.y += this.vy + srazkyY    
                this.z += this.vz + srazkyZ
                */

                this.x += this.vx
                this.y += this.vy  
                this.z += this.vz
            };

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
    
    //ANIMATION
    const [rotationAsteroids, setRotationAsteroids] = useState(0);
    useFrame(() => {
    //useEffect(() => {    
        setRotationAsteroids(rotationAsteroids + Math.PI / 3000);
        //filter asteroids with r=0 for render;
        setFilteredAsteroids(asteroids.filter((agent) => agent.r !== 0));
        //filter asteroids with r=0 for planet 1 growing;
        setAsteroidWithZeroR(asteroids.filter((agent) => agent.r === 0));
        setPlanet1Growing(asteroidWithZeroR.length);
        asteroids.forEach((agent, index) => {
            agent.update(xb1, yb1, zb1, mb1, rb1, selfGravitation, asteroids);
        });
    });
    //}, [setState]);

    return (
        <>
            <group name="ASTEROIDS" rotation={[0, 0, 0]}>
                {filteredAsteroids.map((asteroid) => (
                    <mesh key={randomRange(0, 1000000)} position={[asteroid.x, asteroid.y, asteroid.z]}>
                        <sphereGeometry args={[asteroid.r, 8, 4]} />
                        <meshStandardMaterial args={[{ color: 0xa29890 }]} />
                    </mesh>
                ))}                
            </group>        
        </>
    )
};

export default Asteroids;