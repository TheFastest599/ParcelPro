const emailExistence = require('email-existence');

function checkEmail(email) {
  return new Promise((resolve, reject) => {
    emailExistence.check(email, function (error, response) {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}

async function getEmailResponse(email) {
  try {
    const response = await checkEmail(email);
    return response;
  } catch (error) {
    return false;
  }
}

(async () => {
  const emails = [
    'iihhgg@gm.bm',
    'ribhusaha2003@gmail.com',
    'ribhusaha2003@gmail.com',
    'ribhusaha2003@gmail.com',
    'ribhusaha2003@gmail.com',
  ];

  const results = await Promise.all(
    emails.map(email => getEmailResponse(email))
  );

  results.forEach((result, index) => {
    console.log(`Result ${index + 1}: ${result}`);
  });
})();
