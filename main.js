// select all pieces with classname "piece"
const getPieces = () => document.querySelectorAll(".piece");

const HUD = document.createElement("div");

HUD.style.position = "fixed";
HUD.style.top = "0";
HUD.style.right = "0";
document.body.appendChild(HUD);

// create a new div to hold the button
const buttonContainer = document.createElement("div");
buttonContainer.style.backgroundColor = "rgba(215, 215, 215, 1)";
buttonContainer.style.padding = "10px";
buttonContainer.style.borderRadius = "5px";
buttonContainer.style.fontSize = "20px";

function getPieceLocations() {
  const pieceList = [];

  const colorPieceTypePattern = /([wb])([pnbrqk])/;
  const locationPattern = /square-(\d+)/;

  getPieces().forEach((piece) => {
    const pieceTypeMatch = piece.className.match(colorPieceTypePattern);
    const locationMatch = piece.className.match(locationPattern);

    if (pieceTypeMatch && locationMatch) {
      const color = pieceTypeMatch[1];
      const pieceType = pieceTypeMatch[2];
      const location = parseInt(locationMatch[1]);

      pieceList.push({
        className: piece.className,
        color: color === "w" ? "white" : "black",
        piece:
          pieceType === "p"
            ? "pawn"
            : pieceType === "r"
            ? "rook"
            : pieceType === "n"
            ? "knight"
            : pieceType === "b"
            ? "bishop"
            : pieceType === "q"
            ? "queen"
            : "king",
        location: location,
        url: `https://www.chess.com/chess-themes/pieces/neo/150/${
          color + pieceType
        }.png`,
      });
    }
  });

  return pieceList;
}
const PIECE_CONTAINER_ID = "piece-container";
function toggleOpacityOff() {
  console.log(">> toggleOpacityOff", getPieceLocations());
  setGlobalOpacity(0);
  setPieceLocationData();
}
function toggleOpacityOn() {
  setGlobalOpacity(1);
}
function setGlobalOpacity(opacity) {
  const pieces = getPieces();
  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i];
    piece.style.opacity = opacity;
  }
}
function setPieceLocationData() {
  const pieces = getPieceLocations();
  // create a new div to hold the pieces and their locations
  const pieceContainer = document.createElement("div");
  pieceContainer.id = PIECE_CONTAINER_ID;
  pieceContainer.style.backgroundColor = "rgba(215, 215, 215, 1)";
  pieceContainer.style.padding = "10px";
  pieceContainer.style.borderRadius = "5px";
  pieceContainer.style.fontSize = "20px";
  pieceContainer.style.maxHeight = "100vh";
  pieceContainer.style.overflowY = "scroll";
  pieceContainer.style.zIndex = "99999";

  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i];
    const pieceNode = document.createElement("div");
    pieceNode.style.display = "flex";
    pieceNode.style.alignItems = "center";
    pieceNode.style.marginBottom = "5px";

    const pieceImage = document.createElement("img");
    pieceImage.src = piece.url;
    pieceImage.style.width = "45px";
    pieceImage.style.height = "45px";
    pieceImage.style.marginRight = "10px";
    pieceNode.appendChild(pieceImage);

    const pieceInfo = document.createElement("div");
    // map location to chess board notation (11 --> A1, 88 --> H8)
    const rawFile = String(piece.location).charAt(0);
    const rawRank = String(piece.location).charAt(1);
    const file = String.fromCharCode(97 + parseInt(rawFile) - 1);
    const rank = parseInt(rawRank);
    pieceInfo.textContent = `${piece.color} ${piece.piece} at ${file}${rank}`;
    pieceNode.appendChild(pieceInfo);

    pieceContainer.appendChild(pieceNode);
  }

  // remove the old container if it exists
  const oldPieceContainer = document.getElementById(PIECE_CONTAINER_ID);
  if (oldPieceContainer) {
    oldPieceContainer.remove();
  }
  // add the container to the body
  HUD.appendChild(pieceContainer);
}
function cancel() {
  // remove the container from the body
  document.body.removeChild(buttonContainer);
}

// add the button to the container
HUD.appendChild(buttonContainer);
// create the cancel button and add it to the container
const cancelButton = document.createElement("button");
cancelButton.textContent = "Cancel";
cancelButton.addEventListener("click", cancel);
buttonContainer.appendChild(cancelButton);

// create a button to set the opacity to 0
const opacity0 = document.createElement("button");
opacity0.textContent = "Opacity 0";
opacity0.addEventListener("click", toggleOpacityOff);
buttonContainer.appendChild(opacity0);

// create a button to set the opacity to 1
const opacity1 = document.createElement("button");
opacity1.textContent = "Opacity 1";
opacity1.addEventListener("click", toggleOpacityOn);
buttonContainer.appendChild(opacity1);

let puzzleCount = 0;
const timeoutLength = 4;
document.addEventListener("click", function (event) {
  console.log(">> event.target", event.target.tagName);
  if (
    event.target.getAttribute("aria-label") === "Next Puzzle" ||
    // if it is a span with class "arrow-right"
    (event.target.tagName === "SPAN" &&
      event.target.classList.contains("arrow-right"))
  ) {
    toggleOpacityOn();
    puzzleCount++;
    const currentPuzzleCount = puzzleCount;
    let countdown = timeoutLength; // seconds until toggleOpacityOff is called
    const countdownNode = document.createElement("div");
    countdownNode.style.position = "fixed";
    countdownNode.style.top = "30px";
    countdownNode.style.left = "50%";
    countdownNode.style.transform = "translate(0%, -50%)";
    countdownNode.style.backgroundColor = "rgba(215, 215, 215, 1)";
    countdownNode.style.padding = "10px";
    countdownNode.style.borderRadius = "5px";
    countdownNode.style.fontSize = "20px";
    countdownNode.innerText = `Opacity will be triggered off in ${countdown} seconds`;
    document.body.appendChild(countdownNode);

    const countdownInterval = setInterval(() => {
      countdownNode.innerText = `Opacity will be triggered off in ${countdown} seconds`;
      countdown--;
      if (currentPuzzleCount !== puzzleCount) {
        clearInterval(countdownInterval);
        return;
      }
      if (countdown < 0) {
        countdownNode.remove();
        clearInterval(countdownInterval);
        // if the countdown is over, toggle the opacity off in .3 seconds
        setTimeout(() => {
          toggleOpacityOff();
        }, 300);
      }
    }, 1000);
  }
});

// const pieceNode = document.createElement("div");
// // set the classname to "piece wr square-22"
// pieceNode.className = "piece wr square-22";
// pieceNode.style.position = "absolute";
// // set width and height to 45px
// pieceNode.style.width = "45px";
// pieceNode.style.height = "45px";

// // add the piece to the board
// document.body.appendChild(pieceNode);

// // Select the element you want to observe
// // const targetNode = document.querySelector(".sidebar-play-streak");
// const targetNode = document.querySelector(".sidebar-container");
// // Create an observer instance linked to the callback function
// const observer = new MutationObserver(callback);
// // Start observing the target node for configured mutations
// observer.observe(targetNode, config);

// Options for the observer (which mutations to observe)
// const config = {childList: true, characterData: true, subtree: true };
// Callback function to execute when mutations are observed
// const callback = function (mutationsList, observer) {
//   toggleOpacityOn();
//   puzzleCount++;
//   const currentPuzzleCount = puzzleCount;
//   for (const mutation of mutationsList) {
//     if (mutation.type === "childList" || mutation.type === "characterData") {
//       let countdown = timeoutLength; // seconds until toggleOpacityOff is called
//       const countdownNode = document.createElement("div");
//       countdownNode.style.position = "fixed";
//       countdownNode.style.top = "30px";
//       countdownNode.style.left = "50%";
//       countdownNode.style.transform = "translate(0%, -50%)";
//       countdownNode.style.backgroundColor = "rgba(215, 215, 215, 1)";
//       countdownNode.style.padding = "10px";
//       countdownNode.style.borderRadius = "5px";
//       countdownNode.style.fontSize = "20px";
//       countdownNode.innerText = `Opacity will be triggered off in ${countdown} seconds`;
//       document.body.appendChild(countdownNode);

//       const countdownInterval = setInterval(() => {
//         countdownNode.innerText = `Opacity will be triggered off in ${countdown} seconds`;
//         countdown--;
//         if (currentPuzzleCount !== puzzleCount) {
//           clearInterval(countdownInterval);
//           return;
//         }
//         if (countdown < 0) {
//           countdownNode.remove();
//           clearInterval(countdownInterval);
//           // if the countdown is over, toggle the opacity off in .3 seconds
//           setTimeout(() => {
//             toggleOpacityOff();
//           }, 300);
//         }
//       }, 1000);
//     }
//   }
// };
