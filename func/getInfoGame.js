const { default: axios } = require("axios");

exports.getInfoGame = async (token) => {
  try {
    const info = await axios.post(
      "https://fishapi.xboost.io/zone/user/gamestate",
      {},
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return info.data.data;
  } catch (error) {
    console.log(error);
  }
};
