const { buyFish } = require("./buyFish");
const { validateToken } = require("./CheckValidToken");
const { composeFish } = require("./compose-fish");
const { getInfoGame } = require("./getInfoGame");

async function main() {
  try {
    const tokens = await validateToken();

    for (const token of tokens) {
      while (true) {
        // Fetch the current gold value
        let validate = await validationStatus(token.token);
        if (validate === null) {
          console.log("You have logged on another device  [ main ]");
          await delay(5 * 60 * 1000);
          validate = await validationStatus(token);
          console.log(validate);
          main();
          continue;
        }
        gameStat(token.token);
        await composeFish(token.token);
        const infoGame = await getInfoGame(token.token);
        let levelToBuy = infoGame?.level - 5;
        const buy = await buyFish(levelToBuy, token.token);

        if (buy.results[0] === "reach fish amount limit") {
          console.log("reach fish amount limit");
        } else {
          while (true) {
            levelToBuy = infoGame.level - 5;
            const buy = await buyFish(levelToBuy, token.token);
            console.log("Buy fish successfull", buy);
            if (buy.results[0] === "balance not enough") {
              console.log("balance not enough");
              break;
            }
            if (buy.results[0] === "reach fish amount limit") {
              console.log("reach fish amount limit");
              break;
            }
          }
        }
        // Wait for 5 seconds before checking again
        await new Promise((resolve) => setTimeout(resolve, 20000));
      }
    }
  } catch (error) {
    console.log(error);
  }
}

const validationStatus = async (token) => {
  try {
    const infoGame = await getInfoGame(token);
    return infoGame;
  } catch (error) {
    console.log(error);
  }
};

async function gameStat(token) {
  // Replace with your actual token
  while (true) {
    let validate = await validationStatus(token);
    if (validate === null) {
      console.log("You have logged on another device [ Game stat ]");
      await delay(5 * 60 * 1000);
      validate = await validationStatus(token);
      console.log(validate);
      gameStat();
      continue;
    }
    const infoGame = await getInfoGame(token);
    const statGame = {
      gold: infoGame?.gold || 0,
      diamond: infoGame?.diamond || 0,
      level: infoGame?.level || 0,
    };
    console.log(createBoxedMessage(statGame));

    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
}
function createBoxedMessage(infoGame) {
  const goldText = `Gold Game : ${formatNumber(infoGame.gold)}`;
  const diamondText = `Diamond   : ${formatNumber(infoGame.diamond)}`;
  const levelText = `Level     : ${infoGame.level}`;

  const maxLength = Math.max(
    goldText.length,
    diamondText.length,
    levelText.length
  );
  const border = "*".repeat(maxLength + 4);

  const paddedGoldText = `* ${goldText.padEnd(maxLength)} *`;
  const paddedDiamondText = `* ${diamondText.padEnd(maxLength)} *`;
  const paddedLevelText = `* ${levelText.padEnd(maxLength)} *`;

  return `${border}\n${paddedGoldText}\n${paddedDiamondText}\n${paddedLevelText}\n${border}`;
}
function formatNumber(num) {
  if (num >= 1e18) {
    return (num / 1e18).toFixed(1) + "Qi";
  } else if (num >= 1e15) {
    return (num / 1e15).toFixed(1) + "Q";
  } else if (num >= 1e12) {
    return (num / 1e12).toFixed(1) + "T";
  } else if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + "B";
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + "M";
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + "K";
  } else {
    return num.toString();
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { main, validationStatus };
// Wait for 10 seconds before making the next request
