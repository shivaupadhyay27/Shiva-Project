import { openDB } from "idb"

const dbPromise = openDB("puzzleDB",1,{
  upgrade(db){

    db.createObjectStore("activity",{keyPath:"date"})

  }
})

export async function saveDailyActivity(data){

  const db = await dbPromise

  return db.put("activity",data)

}

export async function getAllActivity(){

  const db = await dbPromise

  return db.getAll("activity")

}

export async function getActivityByDate(date){

  const db = await dbPromise

  return db.get("activity",date)

}