import "./GameBoard.css"

function GameBoard({cards,handleClick}) {

  return (
    <div className="board">

      {cards.map(card => (

        <div
          key={card.id}
          className={`card ${card.flipped || card.matched ? "flipped":""}`}
          onClick={()=>handleClick(card)}
        >

          {card.flipped || card.matched ? card.emoji : "❓"}

        </div>

      ))}

    </div>
  )
}

export default GameBoard