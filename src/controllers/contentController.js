const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../../content.json');

exports.getContent = (req, res, next) => {
  fs.readFile(DB_FILE, 'utf8', (err, data) => {
    if (err) {
      return next(new Error('Failed to read content database.'));
    }
    try {
      const parsed = JSON.parse(data);
      res.json(parsed);
    } catch (parseErr) {
      return next(new Error('Corrupted content database JSON format.'));
    }
  });
};

exports.saveContent = (req, res, next) => {
  const payload = req.body;
  const jsonString = JSON.stringify(payload, null, 2);

  fs.writeFile(DB_FILE, jsonString, 'utf8', (err) => {
    if (err) {
      return next(new Error('Failed to write database updates.'));
    }
    console.log('[+] Content database safely updated via Visual Editor.');
    res.json({
      status: 'success',
      message: 'Website content synchronized securely.'
    });
  });
};
