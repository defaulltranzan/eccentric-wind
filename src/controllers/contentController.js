const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../../content.json');
const BACKUP_FILE = path.join(__dirname, '../../content.backup.json');
const TMP_FILE = path.join(__dirname, '../../content.json.tmp');

exports.getContent = (req, res, next) => {
  fs.readFile(DB_FILE, 'utf8', (err, data) => {
    if (err) {
      return next(new Error('Failed to read content database.'));
    }
    try {
      res.json(JSON.parse(data));
    } catch (parseErr) {
      return next(new Error('Corrupted content database JSON format.'));
    }
  });
};

/**
 * Persist the content database.
 * Reaches here only after requireAdmin + validateSavePayload.
 * Writes are: backed up, size-capped, and atomic (temp file + rename).
 */
exports.saveContent = (req, res, next) => {
  const payload = req.body;
  let jsonString;
  try {
    jsonString = JSON.stringify(payload, null, 2);
  } catch (_) {
    return res.status(400).json({ status: 'error', message: 'Payload is not serialisable.' });
  }

  if (Buffer.byteLength(jsonString, 'utf8') > 512 * 1024) {
    return res.status(413).json({ status: 'error', message: 'Content payload too large.' });
  }

  // Best-effort backup of the current known-good database
  try {
    if (fs.existsSync(DB_FILE)) {
      fs.copyFileSync(DB_FILE, BACKUP_FILE);
    }
  } catch (backupErr) {
    console.error('[!] Content backup failed, aborting write:', backupErr.message);
    return next(new Error('Could not back up the current database.'));
  }

  fs.writeFile(TMP_FILE, jsonString, 'utf8', (err) => {
    if (err) {
      return next(new Error('Failed to write database updates.'));
    }
    fs.rename(TMP_FILE, DB_FILE, (renameErr) => {
      if (renameErr) {
        return next(new Error('Failed to commit database updates.'));
      }
      console.log('[+] Content database updated by an authorised editor.');
      res.json({ status: 'success', message: 'Website content saved.' });
    });
  });
};
