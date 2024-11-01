const HTML_TEMPLATE = (
  title,
  message,
  dateTime,
  email = 'ribhusaha2003@gmail.com'
) => {
  const client = process.env.CLIENT_URL;
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Email Template</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');
      </style>
    </head>
    <body style="font-family: 'Poppins', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; color: #333;">
      <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #dddddd;">
          <h1 style="margin: 0; font-size: 28px; color: #333;"><a href="${client}" style="text-decoration: none; color: #333;">ParcelPro</a></h1>
        </div>
        <div style="padding: 20px 0;">
          <h2 style="font-size: 22px; color: #333; margin-bottom: 10px;">${title}</h2>
          <p style="font-size: 16px; line-height: 1.5; margin: 0 0 10px;">${message}</p>
        </div>
        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #dddddd; font-size: 14px; color: #777;">
          <p style="margin: 5px 0;">With regards,</p>
          <p style="margin: 5px 0;">Team ParcelPro</p>
          <p style="margin: 5px 0;">${dateTime}</p>
          <p style="margin: 5px 0;">ParcelPro</p>
          <p style="margin: 5px 0;"><a href="mailto:${email}" style="text-decoration: none; color: #007bff;">${email}</a></p>
        </div>
      </div>
    </body>
  </html>`;
};

module.exports = HTML_TEMPLATE;
