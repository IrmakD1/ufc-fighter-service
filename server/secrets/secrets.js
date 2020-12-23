const path = require('path');
const fs = require('fs');

const convertToEnvVar = fileName => {
  let string = fileName;
  string = string.replace(/([a-z])([A-Z])/g, '$1_$2');
  string = string.replace(/([A-Z])([A-Z][a-z])/g, '$1_$2').toUpperCase();
  return string;
};

const getSecrets = mntSecretPath => {
  try {
    const directoryPath = path.join(__dirname, mntSecretPath);
    fs.readdirSync(directoryPath).forEach(fileName => {
      const envFilePath = `${directoryPath}/${fileName}`;
      const value = fs.readFileSync(envFilePath, 'utf8');
      const envVar = convertToEnvVar(fileName);
      process.env[envVar] = value;
    });
  } catch (err) {
    throw Error(`Unable to get secrets - ${err}`);
  }
};

module.exports = () => {
  const mntSecretPath = process.env.MNT_SECRETS_PATH;

  if (!mntSecretPath) {
    throw Error('MNT_SECRETS_PATH not specified.');
  }

  getSecrets(mntSecretPath);
};
