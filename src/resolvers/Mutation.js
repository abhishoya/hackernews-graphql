const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

async function signup(parent, args, context, info) {
    const password = await bcrypt.hash(args.password, 10)
    const user = await context.prisma.createUser({ ...args, password })
    const token = jwt.sign({ userId: user.id }, APP_SECRET)
    return {
      token,
      user,
    }
}
  
async function login(parent, args, context, info) {
    const user = await context.prisma.user({ email: args.email })
    if (!user) {
      throw new Error('No such user found')
    }
    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) {
      throw new Error('Invalid password')
    }
    const token = jwt.sign({ userId: user.id }, APP_SECRET)
    return {
      token,
      user,
    }
}

function postLink(root, args, context) {
    const userId = getUserId(context)
    return context.prisma.createLink({
      url: args.url,
      description: args.description,
      postedBy: {connect: {id: userId}},
    })
}

async function updateLink(parent,args,context){
    const userId = getUserId(context)
    const links = await context.prisma.user({id: userId}).links();
    const valid = await links.find(link=>link.id===args.id)
    if(!valid) {
        throw new Error("Not authorized")
    }
    return context.prisma.updateLink({
        where: {id: args.id}, 
        data: {
            url: args.url,
            description: args.description,
        }
    })
}

async function deleteLink(parent,args,context){
    const userId = getUserId(context)
    const links = await context.prisma.user({id: userId}).links();
    const valid = await links.find(link=>link.id===args.id)
    if(!valid) {
        throw new Error("Not authorized")
    }
    return context.prisma.deleteLink({id: args.id})
}

module.exports = {
    signup,
    login,
    postLink,
    updateLink,
    deleteLink
}