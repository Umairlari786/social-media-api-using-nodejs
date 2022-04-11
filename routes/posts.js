const router=require("express").Router();
const Post=require("../models/Post");
const User = require("../models/User");

// @ create a post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
      console.log(res);
    } catch (err) {
      res.status(500).json(err);
    }
  });
//  @ update a post
router.put("/:id", async(req,res)=>{
  try{
    const post= await Post.findById(req.params.id);
    if(post.userId === req.body.userId){
      try{
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set:req.body,
          },
          {new:true});
          res.sendStatus(200).json(updatedPost);
          console.log(res);

      } catch(err){
        res.sendStatus(500).json(err);
      }
    }else{
      res.sendStatus(401).json("you can update only your account :");
    }
  } catch(err){
    res.sendStatus(500).json(err);
  }

})
//  @ delete a post
router.delete("/:id", async(req,res)=>{
  try{
    const post =await Post.findById(req.params.id);
    if(post.userId === req.body.userId){
       
          await Post.deleteOne();
          res.sendStatus(200).json("post has been deleted :")
          console.log(res);
       
    } else{
      res.sendStatus(401).json("you are not user so cannot delete this post :");
    }
  } catch(err){
    res.sendStatus(500).json(err);
  }
})
// @ like and dislike a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//  @ getting post
router.get("/:id", async(req,res)=>{
  try{
    const post = await Post.findById(req.params.id);
    res.sendStatus(200).json(post);
    console.log(res);
  } catch(err){
    req.sendStatus(500).json(err);
    
  }
});
//  @ get timeline posts
router.get("/timeline/all", async(req,res)=>{
  try{
    const currentUser =await User.findById(req.body.userId);
    const userPosts =await Post.find({userId: currentUser._id});
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendsId)=>{
       return  Post.find({userId:friendsId} );
      })
    );
    res.sendStatus(200).json(...friendPosts);
    console.log(res);

  } catch(err){
    res.sendStatus(500).json(err);
  }
})

module.exports=router;