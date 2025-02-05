const prisma = require('../config/prisma')

exports.listUsers = async (req,res)=> {
    try {
        const users = await prisma.user.findFirst({
            select: {
                id: true,
                email: true,
                role: true,
                enabled: true,
                address : true,

            }
        })
        res.json(users)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.changeStatus = async (req,res)=> {
    try {
        const { id, enabled } = req.body;
        console.log(id, enabled);
        const user = await prisma.user.update({
            where: { id:Number(id)},
            data: {enabled: enabled}
        })
        res.send('Update Status Success')
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.changeRole = async (req,res)=> {
    try {
        const { id, role } = req.body;
        console.log(id, role);
        const user = await prisma.user.update({
            where: { id:Number(id)},
            data: {role: role}
        })
        res.send('Update Role Success')
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.userCart = async (req,res)=> {
    try {
        const { cart } = req.body
        console.log(cart)
        console.log(req.user.id)

        const user = await prisma.user.findFirst({
            where: {
                id: Number(req.user.id)
            }
        })
       // console.log(user)

        await prisma.productOnCart.deleteMany({
            where: {
                cart: {
                    orderedById: user.id
                }
            }
        })

        await prisma.cart.deleteMany({
            where: {
                orderedById: user.id
            }
        })

        let products = cart.map((item) => ({
            productId: item.id,
            count: item.count,
            price: item.price,
        }));


        let cartTotal = products.reduce((sum, item)=> sum+item.price * item.count, 0)

        const newCart = await prisma.cart.create({
            data: {
                products: {
                    create: products
                },
                cartTotal: cartTotal,
                orderedById: user.id
            }
        })

        console.log(newCart)
        res.send('Add Cart Ok')
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.getUserCart = async (req,res)=> {
    try {
         const cart = await prisma.cart.findFirst({
             where: {
                 orderedById: Number(req.user.id)
             },
             include: {
                 products: {
                     include: {
                         product: true
                     }
                 }
             }
         })
       // console.log(cart)
        res.json({
            products: cart.products,
            cartTotal: cart.cartTotal
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.emptyCart = async (req,res)=> {
    try {
        const cart = await prisma.cart.findFirst({
            where: { orderedById: Number(req.user.id) }
        })

        if(!cart){
            return res.status(400).json({ message: 'Cart not found' })
        }
        await prisma.productOnCart.deleteMany({
            where: {
                cartId: cart.id
            }
        })

        const result = await prisma.cart.deleteMany({
            where: {
                orderedById: Number(req.user.id)
            }
        })

        console.log(result)
        res.json({
            message: 'Cart Empty Success',
            deletedCount: result.count
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.saveAddress = async (req,res)=> {
    try {
        const { address } = req.body
        console.log(address)
        const addressUser = await prisma.user.update({
            where: {
                id: Number(req.user.id)
            },
            data: {
                address: address
            }
        })
        res.json({ ok: true, message: 'Address update Success'})
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.saveOrder = async (req,res)=> {
    try {
        const userCart = await prisma.cart.findFirst({
            where: {
                orderedById: Number(req.user.id)
            },
            include: { products: true }
        })

        if(!userCart || userCart.products.length === 0){
            return res.status(400).json({ ok: false, message: 'Cart is empty' })
        }


    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.getOrder = async (req,res)=> {
    try {
        res.send('Hello getOrder')
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}