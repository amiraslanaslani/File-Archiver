const sqlite3 = require('sqlite3')

var db;

exports.load = () => {
    db = new sqlite3.Database("./db.sqlite", (err) => {
        if (err) {
            console.log(err);
        }
    })

    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS files
                (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    description TEXT,
                    file_name TEXT,
                    using_path INTEGER
                )`, (err) => {
            console.log(err);
        });

        db.run(`CREATE TABLE IF NOT EXISTS files_tags
                (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    file_id INTEGER,
                    tag TEXT
                )`, (err) => {
            console.log(err);
        });
    })

    return db;
}

exports.reset = () => {
    db.run(
        `DELETE FROM files`
        ,(err) => {
            console.log(err);
        }
    );

    db.run(
        `DELETE FROM files_tags`
        ,(err) => {
            console.log(err);
        }
    );
}
