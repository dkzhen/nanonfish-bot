const { default: axios } = require("axios");
const { validateToken } = require("./CheckValidToken");

async function composeFish(token) {
  async function fetchFishes() {
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
      return info.data.data.fishes;
    } catch (error) {
      console.log(error.message);
      return;
    }
  }

  try {
    let fishes = await fetchFishes();

    while (true) {
      // Hitung frekuensi setiap elemen
      const freq = fishes.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {});

      // Buat pasangan dan kirim permintaan POST
      let pairFound = false;
      for (const [key, value] of Object.entries(freq)) {
        if (value >= 2) {
          for (let i = 0; i < Math.floor(value / 2); i++) {
            try {
              const response = await axios.post(
                "https://fishapi.xboost.io/zone/user/gameactions",
                {
                  actions: [
                    {
                      action: "compose",
                      id: Number(key), // Menggunakan key sebagai id
                    },
                  ],
                },
                {
                  headers: {
                    Authorization: `${token}`,
                  },
                }
              );
              console.log(`Pair ${key} posted successfully:`, response.data);
              pairFound = true;
            } catch (error) {
              console.error(`Error posting pair ${key}:`, error);
            }
          }
        }
      }

      if (!pairFound) {
        return "no pairs fish found";
      }

      // Fetch ulang data fishes setelah setiap POST
      fishes = await fetchFishes();
    }
  } catch (error) {
    // console.log(error);
    return;
  }
}

module.exports = { composeFish };
