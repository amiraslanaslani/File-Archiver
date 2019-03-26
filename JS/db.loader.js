const sqlite3 = require('sqlite3')

exports.load = () => {
    let db = new sqlite3.Database("./db.sqlite", (err) => {
        if (err) {
            return false;
        }
    })

    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS files
                (
                    id INTEGER PRIMARY KEY,
                    name TEXT,
                    description TEXT,
                    file_name TEXT
                )`, (err) => {
            console.log(err);
        });

        db.run(`CREATE TABLE IF NOT EXISTS files_tags
                (
                    id INTEGER PRIMARY KEY,
                    file_id INTEGER,
                    tag TEXT
                )`, (err) => {
            console.log(err);
        });
    })
}
