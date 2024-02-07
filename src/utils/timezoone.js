const getNowDate = () => {
  const timeZoneOffset = new Date().getTimezoneOffset() * 60000;
  const localISOTime = new Date(Date.now() - timeZoneOffset).toISOString().slice(0, -1);
  return localISOTime;
};

module.exports = {
  getNowDate,
};
