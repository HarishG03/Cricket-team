const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
let db = null
let app = express()
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
app.get('/players/', async (request, response) => {
  const query = `SELECT * FROM cricket_team`
  let results = await db.all(query)
  response.send(results)
})

app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const query = `INSERT INTO cricket_team(player_name,jersey_number,role) VALUES (${playerName},${jerseyNumber},${role});`
  await db.run(query)
  response.send('Player Added to Team')
})

app.get('/players/:playerId/', async (request, response) => {
  let {playerId} = request.params
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const query = `SELECT * FROM cricket_team WHERE player_id = ${playerId}`
  const result = await db.get(query)
  response.send(result)
})

app.put('/players/:playerId/', async (request, response) => {
  let {playerId} = request.params
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const query = `UPDATE cricket_team
      SET 
      playerName = ${playerName},
      jerseyNumber = ${jerseyNumber},
      role = ${role}
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
