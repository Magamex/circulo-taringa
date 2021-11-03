// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const axios = require('axios');

const get_post = async(usuario,cantidad=20)=>{
  try {
    const url_story = `https://api-user.taringa.net/user/${usuario}/feed?count=${cantidad}&withTips=true&filter=article&sharedBy=false`;
    const post_res = await axios.get(url_story);
    return post_res.data.items;
  }catch(err){
    return 404
  }
}

const get_info_usuario = async(usuario)=>{
  try{
    const url = `https://api-user.taringa.net/user/${usuario}/about`
    const res = await axios.get(url)
    const {id,username,avatar,suspended} = res.data
    return {id,username,avatar,suspended}
  }catch(err){
    return 404
  }
}

const get_usuarios = async(id)=>{
  try {
    const res = await axios.get(`https://api-user.taringa.net/story/${id}/voters/up?count=300`)
    return res.data.items
  }catch(err){
    return 404
  }
}

export default async function handler(req, res) {
  if(req.query.user == undefined){
    return res.status(404).send('No se encontro el parametro user');
  }

  const posts = await get_post(req.query.user)

  if(posts == 404 || posts.length == 0){
    return res.status(404).send('No se encontro el usuario o no tiene contenido');
  }

  const id_posts = posts.map(post=>{
    return post.id
  })

  // Now magically you can add async to your map function...
Promise.all(id_posts.map(async id => {
  let response
  try {
    response = await get_usuarios(id); 
  } catch (err) {
    return err;
  }
  return response

})).then(async(results) => {
  const result = []
  results.map(arr=>{
    const counts = arr.reduce((p,c)=>{
      var name = c.username
      var avatar = c.avatar
      var id = c.id
      var suspended = c.suspended
      if(!p.hasOwnProperty(name)){
        var cont = {id:id, username: name, avatar:avatar, total: 0, suspended: suspended}
      }
      cont.total++
      result.push(cont)
      return cont
    },{});
  })

  const test = []
  result.forEach(function (a) {
    if (!this[a.username]) {
        this[a.username] = {id:a.id, username: a.username, avatar:a.avatar, total: 0 , suspended:a.suspended};
        test.push(this[a.username]);
    }
    this[a.username].total += a.total;
  }, Object.create(null));

  const ordenado= test.sort(function(a, b){
    return b.total - a.total;
  });

  const group = []
  let inicio = 0
  ordenado.forEach((usuario,index)=>{
    if(index==8 || index==23 || index==49){
      inicio++
    }
    group[inicio] = group[inicio] || [];
    group[inicio].push(usuario)
  })

  const usuario= await get_info_usuario(req.query.user)

  if(usuario == 404 || usuario.length == 0){
    return res.status(404).send('No se encontro el usuario o no tiene contenido');
  }
  // console.log(tests)
  res.status(200).json([{user:usuario},{data:group}])
});

}
