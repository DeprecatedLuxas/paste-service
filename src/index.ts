import express, { Application, Request, Response } from "express";
require("dotenv").config();
import DB from "./db";
const app: Application = express();

const PORT = process.env.PORT || 5000

app.use(express.json());

const db = new DB();

app.get("/", (req: Request, res: Response) => {
    res.send("Nothing here.")
})

app.get("/document/:id", (req: Request, res: Response) => {
    const id = req.params.id;

    db.get(id, (err, doc) => {
        if (err) {
            return res.status(500).json({
                code: err.code,
                message: err.message
            })
        };
        res.setHeader("Content-Type", "text/plain").send(doc);
    });
});


app.post("/document", (req: Request, res: Response) => {
    const content = req.body.content;

    let id = db.generateId();
    db.get(id, (err, doc) => {
        if (err) {
            if (err.message === "The specified key does not exist.") {
                id = db.generateId();
                // The document doesn't exist.
                db.create(id, content, (err, doc) => {
                    if (err) throw err;
                    res.json({
                        doc_id: id,
                        content: content,
                    });
                });
            } else {
                res.json({
                    error: err,
                });
            }
        }
        if (doc) {
            res.json({
                doc_id: id,
                content: content,
            });
        }
    });
});

app.listen(PORT, () => {
    console.log("Server is running on port 5000");
});
