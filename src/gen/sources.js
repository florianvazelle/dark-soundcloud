const {userAgent} = require("../../tools/utils");
const {resolve} = require("path");

module.exports = async (Cookie) => {
  const desktopUserAgent = await userAgent();
  // const mobileUserAgent = await userAgent(true);

  return [
    {
      name: "soundcloud.com",
      url: "https://soundcloud.com/",
      file: resolve(__dirname, "../src/main.css"),
      fetchOpts: {headers: {Cookie, "User-Agent": desktopUserAgent}},
      strict: true,
    },
  ];
};
