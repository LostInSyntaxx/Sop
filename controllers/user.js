exports.listUsers = async (req,res)=> {
    try {
        res.send('Hello users')
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}