const axios = require('axios');
const {createCanvas, loadImage} = require("canvas");
const Canvas = require("canvas");
global.Image = Canvas.Image;
const fs = require("fs");

const traerObj = async(usuario)=>{
    const res = await axios(`/api/usuario?user=${usuario}`)
    return res.data
}

const toRad = (x) => x * (Math.PI / 180);

/**
 *
 * @param config is an array with 4 entries
 * Each entry is an object with the following properties:
 * distance: from the middle of the image to the middle of the circle at the current layer. The bigger the number, the further is the layer from the center
 * count: circles in the current layer
 * radius: of the circles in this layer
 * users: list of users to render in the format {avatar:string}
 * @returns {Promise<void>}
 */
async function render(config) {
	const width = 1000;
	const height = 1000;

	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext("2d");

	// fill the background
	ctx.fillStyle = "#015CAB";
	ctx.fillRect(0, 0, width, height);

	// loop over the layers
	for (const [layerIndex, layer] of config.entries()) {
		const {count, radius, distance, users} = layer;

		const angleSize = 360 / count;

		// loop over each circle of the layer
		for (let i = 0; i < count; i++) {
			// We need an offset or the first circle will always on the same line and it looks weird
			// Try removing this to see what happens
			const offset = layerIndex * 30;

			// i * angleSize is the angle at which our circle goes
			// We need to converting to radiant to work with the cos/sin
			const r = toRad(i * angleSize + offset);

			const centerX = Math.cos(r) * distance + width / 2;
			const centerY = Math.sin(r) * distance + height / 2;

			// if we are trying to render a circle but we ran out of users, just exit the loop. We are done.
			if (!users[i]) break;

			ctx.save();
			ctx.beginPath();
			ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
			ctx.clip();

			const defaultAvatarUrl = "https://abs.twimg.com/sticky/default_profile_images/default_profile_200x200.png";
            
            const avatarUrl = users[i].avatar || defaultAvatarUrl;
            const tempUrl = (avatarUrl.includes('gs://'))?defaultAvatarUrl:avatarUrl;
            
			const img = await loadImage(tempUrl);
   
            ctx.drawImage(
				img,
				centerX - radius,
				centerY - radius,
				radius * 2,
				radius * 2
			);

            if(distance != 0){
                ctx.fillStyle = "#FFFFFF";
                ctx.font = `${radius/4}% Calibri`;
                ctx.fillRect(centerX-radius, centerY-radius+20, radius/3.5*8, radius/3.5*1.3);
                ctx.fillStyle = "#000000";
                ctx.fillText(users[i].username,centerX-radius*0.8, centerY-radius+35)
            }

			ctx.restore();
		}
	}

	// write the resulting canvas to file
	// const out = fs.createWriteStream("./circle.png");
	// const stream = canvas.createPNGStream();
	const stream = canvas.toDataURL();

  return stream;
	// stream.pipe(out);
	// out.on("finish", () => {
    // console.log("Done!")
    // this.image64 = fs.readFileSync("./circle.png", {encoding: 'base64'});
//   });
}

export default async function handler(req, res) {

  const cosas = req.body 

  const layers = [8, 15, 26];

  const image = await render([
		{distance: 0, count: 1, radius: 110, users: [cosas[0].user]},
		{distance: 200, count: layers[0], radius: 64, users: cosas[1].data[0]},
		{distance: 330, count: layers[1], radius: 58, users: cosas[1].data[1]},
		{distance: 450, count: layers[2], radius: 50, users: cosas[1].data[2]},
	])

  res.status(200).json({ img: image})
}
