import pg from 'pg'
const { Pool } = pg

let pool
function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    pool = new Pool({
      connectionString,
      application_name: "",
      max: 1,
    });
  }
  return pool
}

export async function getChats() {
  const res = await getPool().query(`
  SELECT * FROM chats
  ORDER BY timestamp DESC
  `)
  return res.rows
}

export async function createChat(name, userId, username) {
  const res = await getPool().query(`
  INSERT INTO chats (name, user_id, username)
  VALUES ($1, $2, $3)
  RETURNING *
  `, [name, userId, username])

  return res.rows[0]
}

export async function deleteChat(id, userId) {
  // const res = await getPool().query(`
  // DELETE FROM chats
  // WHERE id = $1
  // RETURNING *
  // `, [id])
  
  // await getPool().query(`
  // DELETE FROM messages
  // WHERE chat_id = $1
  // RETURNING *
  // `, [id])


//   const res = await getPool().query(`
//   DELETE FROM chats
//   WHERE id = $1
//   AND user_id = $2
//   RETURNING *
// `, [id, userId])

//   return res.rows[0]



  const res = await getPool().query(`
  WITH deleted_chat AS (
    DELETE FROM chats
    WHERE id = $1
    AND user_id = $2
    RETURNING *
  )
  DELETE FROM messages
  WHERE chat_id = (SELECT id FROM deleted_chat)
  AND user_id = $2
  RETURNING *
`, [id, userId])

  
  return res.rows[0]
}



export async function updateChat(id, name, userId) {
  const res = await getPool().query(`
  UPDATE chats
  SET name = $2
  WHERE id = $1
  AND user_id = $3
  RETURNING *
  `, ([id, name, userId]))
  
  return res.rows[0]
}

// export async function updateChat(id,name) {
//   const updateres = await getPool().query(`
//   UPDATE chats
//   SET name = $2
//   WHERE id = $1
//   RETURNING *
//   `, ([id, name]))
//   const res = await getPool().query(`
//   SELECT * FROM chats
//   ORDER BY timestamp DESC
//   `)
//   return res.rows
// }


export async function getMessages(id) {
  const res = await getPool().query(`
  SELECT * FROM messages
  WHERE chat_id = $1
  ORDER BY timestamp ASC
  `,[id])
  return res.rows
}



export async function createMessage(id, content, userId, username) {
  const res = await getPool().query(
    `
    INSERT INTO messages (chat_id, content, user_id, username)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [id, content, userId, username]
);
  return res.rows[0]
}



export async function deleteMessage(id, userId) {
  const res = await getPool().query(`
  DELETE FROM messages
  WHERE id = $1
  AND user_id = $2
  RETURNING *
  `, [id, userId])
  
  return res.rows[0]
}



export async function updateMessage(id, content, userId) {
  const res = await getPool().query(`
  UPDATE messages
  SET content = $2
  WHERE id = $1
  AND user_id = $3
  RETURNING *
  `, ([id, content,userId]))
  
  return res.rows[0]
}




