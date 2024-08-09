import sqlite3 from 'sqlite3'

const pathToStorage = 'storage/'
// const createEventsQuery = 'CREATE TABLE "events" ( "id" INTEGER PRIMARY KEY AUTOINCREMENT, "user" TEXT, "start_date" TEXT, "end_date" TEXT, "start_time" TEXT, "end_time" TEXT, "title" TEXT, "backgroundColor" TEXT)'
// const createWishListQuery = 'CREATE TABLE "wishlist" ( "id" INTEGER PRIMARY KEY AUTOINCREMENT, "user" TEXT, "start_date" TEXT, "end_date" TEXT, "start_time" TEXT, "end_time" TEXT, "title" TEXT, "backgroundColor" TEXT)'
// const createAttendanceQuery = 'CREATE TABLE "attendance" ( "id" INTEGER PRIMARY KEY AUTOINCREMENT, "user" TEXT, "start_date" TEXT, "end_date" TEXT, "start_time" TEXT, "end_time" TEXT)'

export async function getUserEvents(uuid) {
    const db = openDatabase(`users/${uuid}`)
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM events',
            (error, result) => {
                if (error) {
                    console.log(error)
                    reject(error)
                } else {
                    closeDatabase(db)
                    resolve(result)
                }
            }
        );
    });
}

export async function getUserAttendance(uuid) {
    const db = openDatabase(`users/${uuid}`)
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM attendance',
            (error, result) => {
                if (error) {
                    console.log(error)
                    reject(error)
                } else {
                    closeDatabase(db)
                    resolve(result)
                }
            }
        );
    });
}

export async function getLatestAttendance(uuid) {
    const db = openDatabase(`users/${uuid}`)
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM attendance WHERE id = (SELECT MAX(id) FROM attendance)',
            (error, result) => {
                if (error) {
                    console.log(error)
                    reject(error)
                } else {
                    closeDatabase(db)
                    resolve(result)
                }
            }
        )
    })
}

export async function checkUserIn(body) {
    const db = openDatabase(`users/${body.database}`)
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO attendance (user, start_date, start_time) VALUES (?, ?, ?)',
            [body.email, body.startDate, body.startTime], (error, result) => {
                if (error) {
                    console.log(error)
                    reject(error)
                } else {
                    closeDatabase(db)
                    resolve(result)
                }
            }
        )
    })
}

export async function checkUserOut(body) {
    const db = openDatabase(`users/${body.database}`)
    return new Promise((resolve, reject) => {
        db.run('UPDATE attendance SET end_date = ?, end_time = ? WHERE id = (SELECT MAX(id) FROM attendance)',
            [body.endDate, body.endTime], (error, result) => {
                if (error) {
                    console.log(error)
                    reject(error)
                } else {
                    closeDatabase(db)
                    resolve(result)
                }
            }
        )
    })
}

export async function getUserWishList(uuid) {
    const db = openDatabase(`users/${uuid}`)
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM wishlist',
            (error, result) => {
                if (error) {
                    console.log(error)
                    reject(error)
                } else {
                    closeDatabase(db)
                    resolve(result)
                }
            }
        )
    })
}

export async function saveUserWishList(body) {
    const db = openDatabase(`users/${body.database}`)
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            body.wishlist.forEach(async wish => {
                const { id, user, start_date, start_time, end_date, end_time, title, backgroundColor } = wish;
                db.run('INSERT OR REPLACE INTO wishlist (id, user, start_date, start_time, end_date, end_time, title, backgroundColor) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [id, user, start_date, start_time, end_date, end_time, title, backgroundColor], (error, result) => {
                        if (error) {
                            console.log(error);
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                )
            })
            closeDatabase(db)
        })
    });
}

export async function deleteUserWish(body) {
    const db = openDatabase(`users/${body.database}`)
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM wishlist WHERE id = ?',
            [body.wish], (error, result) => {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    closeDatabase(db);
                    resolve(result);
                }
            }
        );
    });
}

export async function getUserStatus(email) {
    const db = openDatabase('status')
    return new Promise((resolve, reject) => {
        db.all('SELECT is_checked_in FROM status WHERE user = ?',
            [email], (error, result) => {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    closeDatabase(db);
                    resolve(result);
                }
            }
        );
    });
}

export function setUserStatusTrue(email) {
    const db = openDatabase('status')
    return new Promise((resolve, reject) => {
        db.run('UPDATE status SET is_checked_in = TRUE WHERE user = ?', [email], (error, result) => {
            if (error) {
                console.log(error)
                reject(error)
            } else {
                closeDatabase(db)
                resolve(result)
            }
        })
    })
}

export function setUserStatusFalse(email) {
    const db = openDatabase('status')
    return new Promise((resolve, reject) => {
        db.run('UPDATE status SET is_checked_in = FALSE WHERE user = ?', [email], (error, result) => {
            if (error) {
                console.log(error)
                reject(error)
            } else {
                closeDatabase(db)
                resolve(result)
            }
        })
    })
}

function openDatabase(filename) {
    return new sqlite3.Database(`${pathToStorage}${filename}.db`, error => {
        if (error) {
            console.log(error)
        }
    })
}

function closeDatabase(db) {
    db.close(error => {
        if (error) {
            console.log(error)
        }
    })
}
