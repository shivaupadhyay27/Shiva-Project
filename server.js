import express from "express"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())

let stats = {
 completed:0,
 streak:0
}

app.get("/health",(req,res)=>{
 res.json({status:"OK"})
})

app.post("/progress",(req,res)=>{

 stats.completed += 1
 stats.streak += 1

 res.json(stats)

})

app.listen(5000,()=>{
 console.log("Server running on port 5000")
})