const { siteContent } = require("./_lib/content");

module.exports = async (req, res) => {
  res.status(200).json(siteContent);
};
