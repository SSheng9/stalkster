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

export async function createChat(name) {
  const res = await getPool().query(`
  INSERT INTO chats (name)
  VALUES ($1)
  RETURNING *
  `, [name])

  return res.rows[0]
}

export async function deleteChat(id) {
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

  const res = await getPool().query(`
  WITH deleted_chat AS (
    DELETE FROM chats
    WHERE id = $1
    RETURNING *
  )
  DELETE FROM messages
  WHERE chat_id = (SELECT id FROM deleted_chat)
  RETURNING *
`, [id])

  
  return res.rows[0]
}


export async function updateChat(id,name) {
  const res = await getPool().query(`
  UPDATE chats
  SET name = $2
  WHERE id = $1
  RETURNING *
  `, ([id, name]))
  
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
  ORDER BY timestamp DESC
  `,[id])
  return res.rows
}



export async function createMessage(id, content) {
  const res = await getPool().query(
    `
    INSERT INTO messages (chat_id, content)
    VALUES ($1, $2)
    RETURNING *
    `,
    [id, content]
);
  return res.rows[0]
}



export async function deleteMessage(id) {
  const res = await getPool().query(`
  DELETE FROM messages
  WHERE id = $1
  RETURNING *
  `, [id])
  
  return res.rows[0]
}



export async function updateMessage(id, content) {
  const res = await getPool().query(`
  UPDATE messages
  SET content = $2
  WHERE id = $1
  RETURNING *
  `, ([id, content]))
  
  return res.rows[0]
}




