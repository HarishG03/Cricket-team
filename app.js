const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
let db = null
let app = express()
app.use(express.json())
let dbpath = path.join(__dirname, 'cricketTeam.db')
const intializeServerAndDatabase = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server has started !!!')
    })
  } catch (e) {
    console.log(`Error DB :${e.message}`)
    process.exit(1)
  }
}
intializeServerAndDatabase()
express.json()
const convertDbObjectToResponseObject = dbObject => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  }
}

app.get('/players/', async (request, response) => {
  const getPlayersQuery = `
 SELECT
 *
 FROM
 cricket_team;`
  const playersArray = await database.all(getPlayersQuery)
  response.send(
    playersArray.map(eachPlayer => convertDbObjectToResponseObject(eachPlayer)),
  )
})

app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const query = `INSERT INTO cricket_team(player_name,jersey_number,role) VALUES ('${playerName}',${jerseyNumber},'${role}');`
  await db.run(query)
  response.send('Player Added to Team')
})

app.get('/players/:playerId/', async (request, response) => {
  let {playerId} = request.params
  const getPlayersQuery = `
 SELECT
 *
 FROM
 cricket_team
 WHERE player_id = ${playerId};`
  const playersArray = await database.get(getPlayersQuery)
  response.send(
    playersArray.map(eachPlayer => convertDbObjectToResponseObject(eachPlayer)),
  )
})

app.put('/players/:playerId/', async (request, response) => {
  let {playerId} = request.params
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const query = `UPDATE cricket_team
      SET 
      playerName = '${playerName}',
      jerseyNumber = ${jerseyNumber},
      role = '${role}'
      WHERE 
      player_id = ${playerId}`
  await db.run(query)
  response.send('Player Details Updated')
})

app.delete('/players/:playerId/', async (request, response) => {
  let {playerId} = request.params
  const query = `DELETE FROM cricket_team WHERE player_id = ${playerId}`
  const result = await db.run(query)
  response.send('Player Removed')
})

module.exports = app
