const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { tb_user, tb_post } = require("../../models");

exports.register = async (req, res) => {
    // our validation schema here
    const schema = Joi.object({
      fullname: Joi.string().min(3).required(),
      email: Joi.string().email().min(6).required(),
      phone: Joi.string().regex(/^[0-9]{12}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
      password: Joi.string().min(4).required()
    });
  
    // do validation and get error object from schema.validate
    const { error } = schema.validate(req.body);
  
    // if error exist send validation error message
    if (error)
      return res.status(400).send({
        error: {
          message: error.details[0].message,
        },
      });
  
    try {
      const userExist = await tb_user.findOne({
        where: {
          email: req.body.email,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
  
      if (userExist) {
        return res.status(400).send({
          status: "Failed",
          message: "Email already registered",
        })
      }
      
      // we generate salt (random value) with 10 rounds
      const salt = await bcrypt.genSalt(10);
      // we hash password from request with salt
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
      const newUser = await tb_user.create({
        fullname: req.body.fullname,
        email: req.body.email,
        phone: req.body.phone,
        password: hashedPassword,
        status: 'user'
      });
  
      const token = jwt.sign({ id: tb_user.id }, process.env.ACCESS_TOKEN);
  
      const user = ({
          fullname: newUser.fullname,
          token
      })
      
      res.status(200).send({
        status: "Success...",
        data: {user},
      });
    } catch (error) {
        console.log(error);
        res.status(500).send({
        status: "failed",
        message: "Server Error",
        });
    }
};

exports.login = async (req, res) => {
    // our validation schema here
    const schema = Joi.object({
      email: Joi.string().email().min(6).required(),
      password: Joi.string().min(4).required(),
    });
  
    // do validation and get error object from schema.validate
    const { error } = schema.validate(req.body);
  
    // if error exist send validation error message
    if (error)
      return res.status(400).send({
        error: {
          message: error.details[0].message,
        },
      });
  
    try {
      const userExist = await tb_user.findOne({
        where: {
          email: req.body.email,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
  
      if (!userExist) {
        return res.status(400).send({
          status: "Failed",
          message: "Email is not registered",
        })
      }
  
      // compare password between entered from client and from database
      const isValid = await bcrypt.compare(req.body.password, userExist.password);
  
      // check if not valid then return response with status 400 (bad request)
      if (!isValid) {
        return res.status(400).send({
          status: "Failed",
          message: "Password Incorrect",
        });
      }

    //   const profile = await tb_profile.findOne({
    //     where: {
    //       idUser: userExist.id,
    //     },
    //     attributes: {
    //       exclude: ["createdAt", "updatedAt"],
    //     },
    //   })
      
    //   const order = await tb_order.findAll({
    //     where: {
    //       idUser: userExist.id,
    //     },
    //     include: [
    //       {
    //         model: tb_product,
    //         as: "product",
    //         attributes: {
    //           exclude: ["idUser", "createdAt", "updatedAt"],
    //         },
    //       },
    //       {
    //         model: tb_topping,
    //         as: "topping",
    //         attributes: {
    //           exclude: ["idUser", "createdAt", "updatedAt"],
    //         },
    //       },
    //     ],
    //   })

      const token = jwt.sign({ id: userExist.id }, process.env.ACCESS_TOKEN, { expiresIn: '1h' });

      const user = ({
        id: userExist.id,
        fullname: userExist.fullname,
        email: userExist.email,
        status: userExist.status,
        // profile,
        // order,
        token
      })
  
      res.status(200).send({
        status: "success...",
        data: {user},
      });
  
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: "Failed",
        message: "Server Error",
      });
    }
};

exports.checkAuth = async (req, res) => {
    try {
      const id = req.tb_user.id;
  
      const dataUser = await tb_user.findOne({
        where: {
          id,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      });
  
      const post = await tb_post.findOne({
        where: {
          idUser: id,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      })
  
      if (!dataUser) {
        return res.status(404).send({
          status: "failed",
        });
      }
  
      res.send({
        status: "Success...",
        data: {
          user: {
            id: dataUser.id,
            fullname: dataUser.fullname,
            email: dataUser.email,
          },
        },
      });
    } catch (error) {
      console.log(error);
      res.status({
        status: "failed",
        message: "Server Error",
      });
    }
  };