// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

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
		let table = '';
		for (const [layerIndex, layer] of config.entries()) {
		const {count, distance, users} = layer;

		for (let i = 0; i < count; i++) {

			if (!users[i]){
                break;
            } 

			const defaultAvatarUrl = "https://abs.twimg.com/sticky/default_profile_images/default_profile_200x200.png";

            const avatarUrl = users[i].avatar || defaultAvatarUrl;
            const tempUrl = (avatarUrl.includes('gs://'))?defaultAvatarUrl:avatarUrl;

            if(distance==0){
                table+=`<div style="text-align: center">
                            <h2>${users[i].username}</h2>
                            <img style="width:10%" src="${tempUrl}" />
                        </div>
                        <div style="display: flex;text-align: center;height: 300px;overflow-y: auto;">`
            }else{
                if(i==0){
                    table+=`<div style="flex:1">`
                        table+=`<h2>Nivel ${distance}</h2>`
                        table+=`<div>
                                <a href="https://www.taringa.net/${users[i].username}" target=_blank>
                                    <p>${users[i].username}</p>
                                </a>
                            </div>`
                }else{
                    table+=`<div>
                                <a href="https://www.taringa.net/${users[i].username}" target=_blank>
                                    <p>${users[i].username}</p>
                                </a>
                            </div>`
                }


                if(i==count-1){
                    table+=`</div>`
                }
            }

		}
	}

    table +="</div>"
    return table;
}

export default async function handler(req, res) {

  const cosas = req.body 

  const layers = [8, 15, 26];

  const codeTable = await render([
		{distance: 0, count: 1, radius: 110, users: [cosas[0].user]},
		{distance: 1, count: layers[0], radius: 64, users: cosas[1].data[0]},
		{distance: 2, count: layers[1], radius: 58, users: cosas[1].data[1]},
		{distance: 3, count: layers[2], radius: 50, users: cosas[1].data[2]},
	])

  res.status(200).json({ code: codeTable})
}
