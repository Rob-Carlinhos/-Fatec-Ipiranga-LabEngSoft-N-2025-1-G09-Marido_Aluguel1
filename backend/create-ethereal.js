const nodemailer = require('nodemailer');

(async () => {
  const testAccount = await nodemailer.createTestAccount();
  console.log("=== Conta Ethereal Criada ===");
  console.log("User:", testAccount.user);
  console.log("Pass:", testAccount.pass);
  console.log("Host:", testAccount.smtp.host);
  console.log("Port:", testAccount.smtp.port);
})();