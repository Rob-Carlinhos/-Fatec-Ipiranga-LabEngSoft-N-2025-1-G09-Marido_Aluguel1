const nodemailer = require('nodemailer');

(async () => {
  const testAccount = await nodemailer.createTestAccount();
  console.log("Conta de testes Ethereal criada:");
  console.log(testAccount);
})();