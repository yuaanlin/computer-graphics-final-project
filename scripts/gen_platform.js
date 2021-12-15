/**
 * This script can generate an .obj file which is a mesh of a big platform
 *
 * node scripts/gen_platform.js
 *
 * Please set the width and vt first.
 * */

const width = 1000;

const vt = `
vt 0.666657 0.500009
vt 0.666657 0.749994
vt 0.333343 0.749994
vt 0.333343 0.500009 
`

const fs = require('fs')

const v = [];
for(let i = 0; i<width; i++) {
    for(let j=0; j<width;j++) {
        v.push(`v ${i} 0 ${j}`)
    }
}

const f = []
for(let n = 1; n<width; n++) {
    for(let m=1; m<width;m++) {
        f.push(`f ${n*width+m+1}/1/1 ${(n-1)*width+1+m}/2/1 ${(n-1)*width+m}/3/1 ${n*width+m}/4/1`)
    }
}

const vn = `
vn 0 1 0
`;

fs.writeFileSync('./out.obj', v.join('\n') + vt + vn + f.join('\n'))