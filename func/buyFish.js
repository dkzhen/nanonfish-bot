const { default: axios } = require("axios");

exports.buyFish = async (id, token) => {
  try {
    const buy = await axios.post(
      "https://fishapi.xboost.io/zone/user/gameactions",
      {
        actions: [
          {
            action: "buy",
            id: id,
          },
        ],
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return buy.data.data;
  } catch (error) {
    console.log(error.message);
  }
};
