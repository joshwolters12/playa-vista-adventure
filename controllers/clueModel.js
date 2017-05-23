
import Expo, { SQLite } from 'expo';
import __ from 'lodash'
let data = {};

const db = SQLite.openDatabase('projectDB7');

data.addClue = (clue) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(`INSERT INTO clues (description, completed, long, lat, place_name, radius)
                VALUES (?,?,?,?,?,?);`, [clue.description, false, clue.long, clue.lat, clue.place_name, clue.radius],
                (_, { rows: { _array } }) => {
                    console.log('addClue executed')
                    resolve(_array)
                }, (_, err) => {
                    reject(err)
                })
        })
    })
};

data.getAllClues = () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(`SELECT * FROM clues`, [],
                (_, { rows: { _array } }) => {
                    console.log('got Clue')
                    resolve(_array)
                }, (_, err) => {
                    reject(err)
                })
        })
    })
};

data.getClue = (id) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(`SELECT * FROM clues WHERE id = ?`, [id],
                (_, { rows: { _array } }) => {
                    console.log('got Clue')
                    resolve(_array)
                }, (_, err) => {
                    reject(err)
                })
        })
    })
};

data.setToComplete = (id) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(`UPDATE clues SET completed = 1 WHERE id = ?`, [id],
                (_, res) => {
                    console.log('setToComplete on id: ', id, res)
                    resolve(res)
                }, (_, err) => {
                    reject(err)
                })
        })
    })
}

data.getRandomIncompletedClue = () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(`SELECT * FROM clues WHERE completed = 0`, [],
                (_, { rows: { _array } }) => {
                    const res = __.sample(_array)
                    console.log('Selecting random clue...', res)
                    resolve(res)
                }, (_, err) => {
                    reject(err)
                })
        })
    })
}

// data.updateClue = () => { };
// data.deleteClue = () => { };
data.populateCluesIfEmpty = () => {
    const createTable = `CREATE TABLE IF NOT EXISTS clues(
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    description VARCHAR,
                    completed BOOLEAN,
                    long NUMERIC,
                    lat NUMERIC,
                    place_name VARCHAR,
                    radius INTEGER
                    );`

    const checkTable = `SELECT name FROM sqlite_master WHERE type='table';`
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(checkTable, [],
                (_, result) => {
                    console.log('populated', result)
                    resolve(result)
                }, (_, err) => {
                    reject(err)
                })
        })
    }).then(({rows}) => {
        const res =  (rows.length > 0) ? {created: true} : {created: false}
        if (res.created) {
            return Promise.reject(res)
        } else {
            return Promise.resolve(res)
        }
    }).then(res => {
        if (res.created) {
            return Promise.resolve(true)
        } else {
            return new Promise((resolve, reject) => {
                db.transaction(tx => {
                    tx.executeSql(createTable, [],
                        (_, result) => {
                            console.log('Table Created!', result)
                            resolve(result)
                        }, (_, err) => {
                            reject(err)
                        })
                })
            })
        }
    })
    .then(res => {
        const clue1 = {
            description: 'Desc 1',
            long: -118.4222983,
            lat: 33.979500, 
            place_name: 'Codesmith HQ', 
            radius: 80
        }
        return data.addClue(clue1)
    })
    .then(res => {
        const clue1 = {
            description: 'Desc 2',
            long: -118.4182312,
            lat: 33.9767221, 
            place_name: 'Whole Foods', 
            radius: 130
        }
        return data.addClue(clue1)
    })
    .then(res => {
        const clue1 = {
            description: 'Desc 3',
            long: -118.422547,
            lat: 33.977925, 
            place_name: '4hr zone', 
            radius: 160
        }
        return data.addClue(clue1)
    })
    .then((res) => {
        return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM clues', [],
                (_, result) => {
                    console.log('all clues: ', result)
                    resolve(result)
                }, (_, err) => {
                    reject(err)
                })
        })
    })
    })
    .then((res) => {
        return Promise.resolve(true)
    })
    .catch((res) => {
        if (res.created) {
            console.log('table created!')
            return Promise.resolve(res)
        } return Promise.reject(res)
    })
};


export default data;