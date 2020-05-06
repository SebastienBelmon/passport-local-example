/**
 * FAKE DB for example purpose.
 * Should be replaced with a reliable database
 *
 * Comes with 2 methods that finds users either by ID or username
 */

//* fake db
const records = [
  {
    id: 1,
    username: 'seb',
    password: '654321',
    displayName: 'Seb',
    emails: [{ value: 'sebastien.belmon@gmail.com' }],
  },
  {
    id: 2,
    username: 'john',
    password: '123456',
    displayName: 'John Bikou',
    emails: [{ value: 'john.bikou@gmail.com' }],
  },
];

/**
 * find user by its ID
 * @param {number} id ID of the user in db
 * @param {function} cb callback : takes (err, user) as parameters
 * returns a high order cb if no error and password matchs
 */
const findById = (id, cb) => {
  process.nextTick(() => {
    const idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error(`User ${id} does not exist`));
    }
  });
};

/**
 * find user by its username
 * @param {string} username username of the user in db
 * @param {function} cb callback : takes (err, user) as parameters
 * returns a high order cb if no error and password matchs
 */
const findByUsername = (username, cb) => {
  process.nextTick(() => {
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
};

module.exports = {
  users: {
    findById,
    findByUsername,
  },
};
