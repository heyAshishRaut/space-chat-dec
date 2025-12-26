import {Resend} from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendEmail = async (email, otp) => {
    const {data, error} = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: ["theashish32@gmail.com"],
        subject: 'Email Verification',
        html: template01(otp),
    });

    if (error) {
        return { success: false }
    }

    return { success: true }
}

const template01 = (otp) => {
    return `
<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
\t<title></title>
\t<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
\t<meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]>
<xml><w:WordDocument xmlns:w="urn:schemas-microsoft-com:office:word"><w:DontUseAdvancedTypographyReadingMail/></w:WordDocument>
<o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml>
<![endif]--><!--[if !mso]><!--><!--<![endif]-->
\t<style>
\t\t* {
\t\t\tbox-sizing: border-box;
\t\t}

\t\tbody {
\t\t\tmargin: 0;
\t\t\tpadding: 0;
\t\t}

\t\ta[x-apple-data-detectors] {
\t\t\tcolor: inherit !important;
\t\t\ttext-decoration: inherit !important;
\t\t}

\t\t#MessageViewBody a {
\t\t\tcolor: inherit;
\t\t\ttext-decoration: none;
\t\t}

\t\tp {
\t\t\tline-height: inherit
\t\t}

\t\t.desktop_hide,
\t\t.desktop_hide table {
\t\t\tmso-hide: all;
\t\t\tdisplay: none;
\t\t\tmax-height: 0px;
\t\t\toverflow: hidden;
\t\t}

\t\t.image_block img+div {
\t\t\tdisplay: none;
\t\t}

\t\tsup,
\t\tsub {
\t\t\tfont-size: 75%;
\t\t\tline-height: 0;
\t\t}

\t\t@media (max-width:520px) {
\t\t\t.desktop_hide table.icons-inner {
\t\t\t\tdisplay: inline-block !important;
\t\t\t}

\t\t\t.icons-inner {
\t\t\t\ttext-align: center;
\t\t\t}

\t\t\t.icons-inner td {
\t\t\t\tmargin: 0 auto;
\t\t\t}

\t\t\t.mobile_hide {
\t\t\t\tdisplay: none;
\t\t\t}

\t\t\t.row-content {
\t\t\t\twidth: 100% !important;
\t\t\t}

\t\t\t.stack .column {
\t\t\t\twidth: 100%;
\t\t\t\tdisplay: block;
\t\t\t}

\t\t\t.mobile_hide {
\t\t\t\tmin-height: 0;
\t\t\t\tmax-height: 0;
\t\t\t\tmax-width: 0;
\t\t\t\toverflow: hidden;
\t\t\t\tfont-size: 0px;
\t\t\t}

\t\t\t.desktop_hide,
\t\t\t.desktop_hide table {
\t\t\t\tdisplay: table !important;
\t\t\t\tmax-height: none !important;
\t\t\t}
\t\t}
\t</style><!--[if mso ]><style>sup, sub { font-size: 100% !important; } sup { mso-text-raise:10% } sub { mso-text-raise:-10% }</style> <![endif]-->
</head>

<body class="body" style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
\t<table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF;">
\t\t<tbody>
\t\t\t<tr>
\t\t\t\t<td>
\t\t\t\t\t<table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
\t\t\t\t\t\t<tbody>
\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t<td>
\t\t\t\t\t\t\t\t\t<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px; margin: 0 auto;" width="500">
\t\t\t\t\t\t\t\t\t\t<tbody>
\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;">
\t\t\t\t\t\t\t\t\t\t\t\t\t<table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td class="pad" style="width:100%;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="alignment" align="center">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div style="max-width: 500px;"><img src="https://78102cee3f.imgdist.com/pub/bfra/34tcv6wo/i35/t2k/lwy/Ruby%20Gradients%20-%2006.jpeg" style="display: block; height: auto; border: 0; width: 100%;" width="500" alt title height="auto"></div>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t</table>
\t\t\t\t\t\t\t\t\t\t\t\t\t<table class="heading_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td class="pad">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<h1 style="margin: 0; color: #000000; direction: ltr; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 1.2; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19px;"><span class="tinyMce-placeholder" style="word-break: break-word;">EMAIL VERIFICATION CODE</span></h1>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t</table>
\t\t\t\t\t\t\t\t\t\t\t\t\t<table class="heading_block block-3" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td class="pad">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<h1 style="margin: 0; color: #000000; direction: ltr; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 38px; font-weight: 700; letter-spacing: normal; line-height: 1.2; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 46px;"><span class="tinyMce-placeholder" style="word-break: break-word;">${otp}</span></h1>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t</table>
\t\t\t\t\t\t\t\t\t\t\t\t\t<table class="paragraph_block block-4" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td class="pad">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div style="color:#404040;direction:ltr;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:1.2;text-align:center;mso-line-height-alt:19px;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p style="margin: 0;">Enter this code to verify your email in Space.<br>This code is valid for 10 minutes.</p>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t</table>
\t\t\t\t\t\t\t\t\t\t\t\t\t<table class="paragraph_block block-5" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td class="pad">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div style="color:#404040;direction:ltr;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:1.2;text-align:center;mso-line-height-alt:19px;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p style="margin: 0;">If you did not request this, please ignore this email.</p>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t</table>
\t\t\t\t\t\t\t\t\t\t\t\t\t<table class="divider_block block-6" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td class="pad">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="alignment" align="center">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span style="word-break: break-word;">&#8202;</span></td>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</table>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t</table>
\t\t\t\t\t\t\t\t\t\t\t\t\t<table class="paragraph_block block-7" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td class="pad">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div style="color:#000000;direction:ltr;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:1.2;text-align:center;mso-line-height-alt:19px;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p style="margin: 0;">The Space Team</p>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t</table>
\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t</tbody>
\t\t\t\t\t\t\t\t\t</table>
\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t</tbody>
\t\t\t\t\t</table>
\t\t\t\t</td>
\t\t\t</tr>
\t\t</tbody>
\t</table><!-- End -->
</body>

</html>
`
}