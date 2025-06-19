import db from '../model/model.js';

async function getBooks(req,res){
    try {
        const result = await db.query("SELECT * from books ")
        const books = result.rows;
        res.render("index", { books })
    } catch (error) {
        res.status(500).send("Error")
    }
}

export { getBooks };