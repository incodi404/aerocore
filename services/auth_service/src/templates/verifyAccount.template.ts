export const verifyAccountTemplate = (
  name: string,
  link: string,
  expireInMin: number,
) => {
  return `
    <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Verify your account</title>
        </head>

        <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8; padding:40px 0;">
            <tr>
              <td align="center">

                <table width="600" cellpadding="0" cellspacing="0" 
                       style="background:#ffffff; border-radius:8px; padding:40px; box-shadow:0 2px 8px rgba(0,0,0,0.05);">

                  <!-- Logo -->
                  <tr>
                    <td align="center" style="padding-bottom:20px;">
                      <h2 style="margin:0; color:#111;">Verify Your Account</h2>
                    </td>
                  </tr>

                  <!-- Message -->
                  <tr>
                    <td style="color:#444; font-size:16px; line-height:24px; padding-bottom:20px;">
                      Hi ${name},
                      <br /><br />
                      Thanks for signing up. Please verify your email address by clicking the button below.
                      This helps us keep your account secure.
                    </td>
                  </tr>

                  <!-- Button -->
                  <tr>
                    <td align="center" style="padding:20px 0;">
                      <a href="${link}"
                         style="
                           background-color:#2563eb;
                           color:#ffffff;
                           padding:14px 28px;
                           text-decoration:none;
                           border-radius:6px;
                           font-size:16px;
                           font-weight:bold;
                           display:inline-block;
                         ">
                        Verify Account
                      </a>
                    </td>
                  </tr>

                  <!-- fallback link -->
                  <tr>
                    <td style="color:#666; font-size:14px; padding-top:10px;">
                      If the button doesn't work, copy and paste this link into your browser:
                      <br />
                      <a href="${link}" style="color:#2563eb;">
                        ${link}
                      </a>
                    </td>
                  </tr>

                  <!-- expiry -->
                  <tr>
                    <td style="color:#999; font-size:13px; padding-top:20px;">
                      This verification link will expire in ${expireInMin} minutes.
                    </td>
                  </tr>

                  <!-- footer -->
                  <tr>
                    <td style="padding-top:30px; color:#aaa; font-size:12px;" align="center">
                      If you didn’t create this account, you can safely ignore this email.
                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>
        </body>
        </html>
    `;
};
