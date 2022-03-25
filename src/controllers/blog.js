const { tb_post, tb_user} = require('../../models')
const fs = require('fs');
const cloudinary = require("../utils/cloudinary");

exports.addBlog = async (request, response) => {
    try {
      // const { id } = request.params;
      let user = request.tb_user.id;
      let findUser = await tb_user.findOne({
        where: {
          id: user,
        },
      });
  
      findUser = JSON.parse(JSON.stringify(findUser));
      findUser = {
        ...findUser,
      };

      const result = await cloudinary.uploader.upload(request.file.path, {
        folder: "journey-post",
        use_filename: true,
        unique_filename: true,
      });
  
      let newPost = await tb_post.create({
        title: request.body.title,
        desc: request.body.desc,
        image: result.public_id,
        idUser: user,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
  
      newPost = JSON.parse(JSON.stringify(newPost));
      newPost = {
        ...newPost,
        ...findUser,
        image: process.env.FILE_PATH + newPost.image,
      };
  
      response.send({
        status: "Success",
        newPost,
      });
    } catch (error) {
      console.log(error);
      response.send({
        status: "failed",
        message: "server error",
      });
    }
  };
  

exports.getBlogs = async (req, res) => {
    try {
        let data = await tb_post.findAll({
            include: [
              {
                model: tb_user,
                as: "user",
                attributes: {
                  exclude: ["createdAt", "updatedAt", "password"],
                },
              },
            ],
            attributes: {
                exclude: ["updatedAt"],
            },
        });
    
        data = JSON.parse(JSON.stringify(data))
    
        data = data.map((item) => {
            return {
                ...item,
                image: process.env.FILE_PATH + item.image
            }
        })
    
        res.send({
            status: "Success on Getting Blogs",
            data:{
                blogs: data
            },
        });
    } catch (error) {
        res.send({
        status: "Failed",
        message: "Server Error",
        });
    }
};

exports.getBlog = async (req, res) => {
    try {
        const { id } = req.params;
        let data = await tb_post.findOne({
            where: {
                id
            },
            include: [
                {
                    model: tb_user,
                    as: "user",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "password", "email"]
                    },
                }
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt", "idUser"]
            }
        });
    
        data = JSON.parse(JSON.stringify(data))
        data = {
            ...data,
            image: process.env.FILE_PATH + data.image

        }

        res.send({
            status: "Success...",
            message: `Showing Blog with id: ${id}`,
            data: {
                blog: data
            }
        });
    } catch (error) {
        console.log(error);
        res.send({
        status: "Failed",
        message: "Server Error",
        });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const {data} = req.body;
        
        let blog = {
            ...data,
            title: req.body.title,
            desc: req.body.desc,
            image: req.file.filename,
        }
        
        let updatedBlog = await tb_post.update(blog, {
            where: {
                id
            },
        });

        updatedBlog = JSON.parse(JSON.stringify(updatedBlog))
    
        res.send({
            status: 'Success...',
            message: `Blog id: ${id} Updated`,
            data: {
                blog: updatedBlog
            }
        });
    } catch (error) {
        console.log(error);
        res.send({
        status: "Failed",
        message: "Server Error",
        });
    }
};

exports.deleteBlog = async (req, res) => {
    try { 
        const { id } = req.params;

        const blog = await tb_post.findOne({
            where: {
              id
            },
            attributes: ["image"],
        });

        let imageFile = 'uploads/' + blog.image

        // Delete image file
        fs.unlink(imageFile, (err => {
            if (err) console.log(err);
            else console.log("\nDeleted file: " + imageFile);
        }));

        await tb_post.destroy({
            where: {
                id
            },
        });

        res.send({
            status: 'Success...',
            message: `Deleted Blog id: ${id}`,
            data: {
                id
            }
        });
    } catch (error) {
        res.send({
        status: "Failed",
        message: "Server Error",
        });
    }
};

exports.getBlogUser = async (request, response) => {
    try {
      const { id } = request.params;
      let data = await tb_post.findAll({
        where: {
          idUser: id,
        },
        include: [
          {
            model: tb_user,
            as: "user",
            attributes: {
              exclude: ["createdAt", "updatedAt", "password"],
            },
          },
        ],
      });
  
      data = JSON.parse(JSON.stringify(data));
      data = data.map((item) => {
        return {
          ...item,
          image: process.env.FILE_PATH + item.image,
        };
      });
  
      response.send({
        status: "success",
        data: {
          posts: data,
        },
      });
    } catch (error) {
      response.send({
        status: "server error",
      });
      console.log(error);
    }
  };