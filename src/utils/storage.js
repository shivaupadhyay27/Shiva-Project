function StatsPanel({score,time,streak,level}){

  return(

    <div style={{marginBottom:"20px"}}>

      <h3>Level : {level}</h3>
      <h3>Score : {score}</h3>
      <h3>Time : {time}s</h3>
      <h3>🔥 Streak : {streak}</h3>

    </div>

  )
}

export default StatsPanel