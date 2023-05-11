const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
  rejectUnauthenticated,
 } = require('../modules/authentication-middleware');

/**
 * Get all of the items on the shelf
 */
router.get('/', rejectUnauthenticated, (req, res) => {
  let queryText = `SELECT * FROM "item"`;
  pool.query(queryText).then((result) => {
    res.send(result.rows);
  }).catch((error) => {
    console.log(error);
    res.sendStatus(500);
  });
});

/**
 * Add an item for the logged in user to the shelf
 */
router.post('/', rejectUnauthenticated, (req, res) => {
  const item = req.body
  // endpoint functionality
  let queryText = `INSERT INTO "item" ("description", "image_url", "user_id")
                   VALUES ($1, $2, $3);`;
  pool.query(queryText, [item.name, item.image, req.user.id]).then((result) => {
    res.sendStatus(200);
  }).catch((error) => {
    console.log(`Error in POST ${error}`);
    res.sendStatus(501);
  })
});

/**
 * Delete an item
 */
router.delete('/:id', rejectUnauthenticated, (req, res) => {
  // endpoint functionality
  let queryText = `DELETE FROM "item" WHERE id=$1`
  pool.query(queryText, [req.params.id]).then((result) => {
    res.sendStatus(200);
  }).catch((error) => {
    console.log(`Error in DELETE ${error}`);
    res.sendStatus(501);
  })
});

module.exports = router;
