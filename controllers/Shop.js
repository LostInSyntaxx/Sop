const prisma = require("../config/prisma")


exports.create = async (req, res) => {
    try {
        const { title, description, price, quantity, categoryId, images } = req.body;

        const product = await prisma.product.create({
            data: {
                title,
                description,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                categoryId: parseInt(categoryId),
                images: images && images.length > 0 ? {
                    create: images.map(item => ({
                        asset_id: item.asset_id,
                        public_id: item.public_id,
                        url: item.url,
                        secure_url: item.secure_url,
                    }))
                } : undefined
            }
        });

        res.status(201).json(product);
    } catch (err) {
        console.error("Error creating product:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


exports.list = async (req, res) => {
    try {
        const count = parseInt(req.params.count) || 10;
        const products = await prisma.product.findMany({
            take: count,
            orderBy: { createdAt : "desc"},
            include: {
                category: true,
                images: true
            }
        });

        res.json(products);
    } catch (err) {
        console.error("Error listing products:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.read = async (req, res) => {
    try {
        const { id } = req.params
        const products = await prisma.product.findFirst({
            where:{
                id: Number(id)
            },
            include: {
                category: true,
                images: true
            }
        })
        res.send(products)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}


exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, quantity, categoryId, images } = req.body;

        const product = await prisma.product.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                categoryId: parseInt(categoryId),
                images: images && images.length > 0 ? {
                    deleteMany: {},
                    create: images.map(item => ({
                        asset_id: item.asset_id,
                        public_id: item.public_id,
                        url: item.url,
                        secure_url: item.secure_url,
                    }))
                } : undefined
            }
        });

        res.json(product);
    } catch (err) {
        console.error("Error updating product:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


exports.remove = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
        });

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        await prisma.product.delete({
            where: { id: parseInt(id) },
        });

        res.status(204).send();
    } catch (err) {
        console.error("Error deleting product:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


exports.listBy = async (req, res) => {
    try {
        const { sort, order, limit } = req.body;
        console.log(sort, order, limit);

        const products = await prisma.product.findMany({
            take: limit ? parseInt(limit) : 10,
            orderBy: {
                createdAt: order === "desc" ? "desc" : "asc"
            },
            include: {
                category: true
            }
        });

        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};


exports.searchFilters = async (req, res) => {
    try {
        const { title, minPrice, maxPrice } = req.query;

        const products = await prisma.product.findMany({
            where: {
                title: title ? { contains: title, mode: "insensitive" } : undefined,
                price: {
                    gte: minPrice ? parseFloat(minPrice) : undefined,
                    lte: maxPrice ? parseFloat(maxPrice) : undefined
                }
            }
        });
        res.json(products);
    } catch (err) {
        console.error("Error in searchFilters:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};



