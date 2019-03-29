const sqlite3 = require('sqlite3')
const dialogs = require('./dialogs.js');

var db;

exports.load = () => {
    db = new sqlite3.Database("./db.sqlite", (err) => {
        if (err) {
            dialogs.openErrorDialog(err);
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
                )`, 
                function(err) {
                    if(err){
                        dialogs.openErrorDialog(err);
                    }
        });

        db.run(`CREATE TABLE IF NOT EXISTS files_tags
                (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    file_id INTEGER,
                    tag TEXT
                )`, 
                function(err) {
                    if(err){
                        dialogs.openErrorDialog(err);
                    }
        });
    })

    return db;
}

exports.reset = () => {
    db.run(
        `DELETE FROM files`
        ,(err) => {
            dialogs.openErrorDialog(err);
        }
    );

    db.run(
        `DELETE FROM files_tags`
        ,(err) => {
            dialogs.openErrorDialog(err);
        }
    );
}
