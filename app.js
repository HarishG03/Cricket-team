const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const app = express()
const dbPath = path.join(__dirname, 'cricketTeam.db')
app.use(express.json())
let db = null
const initializeServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server started running!!!')
    })
  } catch (e) {
    console.log(`Error DB : S{e.message}`)
    process.exit(1)
  }
}
initializeServer()
const convertToResponseObject = dbObj => {
  return {
    playerId: dbObj.player_id,
    playerName: dbObj.player_name,
    jerseyNumber: dbObj.jersey_number,
    role: dbObj.role,
  }
}

app.get('/players/', async (request, response) => {
  const query = `SELECT * FROM cricket_team`
  const result = await db.all(query)
  response.send(result.map(eachObj => convertToResponseObject(eachObj)))
})

app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const queryPost = `
    INSERT INTO 
    cricket_team (player_name,jersey_number,role) 
    VALUES('${playerName}',${jerseyNumber},'${role}')`
  await db.run(queryPost)
  response.send('Player Added to Team')
})

app.get('/players/:playerId/', async (request, response) => {
  let {playerId} = request.params
  let query = `SELECT * FROM cricket_team
    WHERE player_id = ${playerId}`
  const result = db.get(query)
  response.send(convertToResponseObject(result))
})

app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const query = `
     UPDATE cricket_team
     SET
     player_name = '${playerName}',
     jersey_number = ${jerseyNumber},
     role = ${role}
     WHERE 
     player_id = ${playerId}`
  await db.run(query)
  response.send('Player Details Updated')
})

app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const query = `
    DELETE FROM cricket_team
    WHERE player_id = ${playerId}`
  await db.run(query)
  response.send('Player Removed')
})

module.exports = app
