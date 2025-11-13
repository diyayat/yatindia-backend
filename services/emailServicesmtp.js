import nodemailer from 'nodemailer';

// Initialize nodemailer transporter with ZeptoMail SMTP
const getTransporter = () => {
  const zeptoApiKey = process.env.ZEPTOMAIL_API_KEY;
  const smtpPort = process.env.ZEPTOMAIL_SMTP_PORT || '587';

  if (!zeptoApiKey) {
    console.warn('ZeptoMail API key not configured. Emails will not be sent.');
    return null;
  }

  console.log('ZeptoMail transporter configured successfully');
  
  return nodemailer.createTransport({
    host: 'smtp.zeptomail.com',
    port: parseInt(smtpPort, 10),
    secure: parseInt(smtpPort, 10) === 465, // true for 465, false for other ports
    auth: {
      user: 'emailapikey', // ZeptoMail uses this fixed username
      pass: zeptoApiKey, // Your ZeptoMail API key
    },
  });
};

/**
 * Send email notification for contact form submission
 */
export const sendContactEmail = async (contactData) => {
  try {
    const transporter = getTransporter();
    if (!transporter) {
      console.warn('Email transporter not configured. Skipping email send.');
      return;
    }

    const fromEmail = process.env.ZEPTOMAIL_FROM_EMAIL || process.env.ZEPTOMAIL_BOUNCE_ADDRESS || 'no-reply@yatindia.com';
    // All form submissions go to admin email - NOT to the user
    const toEmail = process.env.ZEPTOMAIL_TO_EMAIL || 'info@yatindia.com';
    // Use Cloudinary logo URL if available, otherwise use public folder
    const logoUrl = process.env.LOGO_URL || process.env.CLOUDINARY_LOGO_URL || 
      'https://res.cloudinary.com/dxnts57kq/image/upload/v1762870110/yatindia/images/YAT_INDIA_LOGO_UPDATED_sgdocn.png' ||
      (() => {
        const backendUrl = process.env.BACKEND_URL || process.env.API_URL || 'http://localhost:4173';
        const logoFileName = encodeURIComponent('YAT INDIA LOGO UPDATED.png');
        return `${backendUrl}/public/${logoFileName}`;
      })();

    const emailContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f0f0f0; font-family: Arial, sans-serif;">
        <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white;">
            <img src="${logoUrl}" alt="YAT India Logo" style="max-width: 200px; height: auto;" />
          </div>
          <div style="padding: 20px;">
            <h2 style="color: #333; margin-top: 0;">New Contact Form Submission</h2>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <div style="margin-bottom: 15px;">
                <strong style="color: #667eea; display: block; margin-bottom: 5px;">Name:</strong>
                <span style="color: #666;">${contactData.name}</span>
              </div>
              <div style="margin-bottom: 15px;">
                <strong style="color: #667eea; display: block; margin-bottom: 5px;">Email:</strong>
                <span style="color: #666;">${contactData.email}</span>
              </div>
              <div style="margin-bottom: 15px;">
                <strong style="color: #667eea; display: block; margin-bottom: 5px;">Phone:</strong>
                <span style="color: #666;">${contactData.phone}</span>
              </div>
              <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd;">
                <small style="color: #999;">Submitted at: ${new Date().toLocaleString()}</small>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: fromEmail,
      to: toEmail,
      subject: 'New Contact Form Submission - Callback Request',
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Contact email sent successfully to:', toEmail);
  } catch (error) {
    console.error('❌ Error sending contact email:', error.message);
    if (error.response) {
      console.error('ZeptoMail API response:', error.response);
    }
    // Don't throw error - we don't want email failures to break form submission
  }
};

/**
 * Send email notification for project inquiry submission
 */
export const sendProjectEmail = async (projectData) => {
  try {
    const transporter = getTransporter();
    if (!transporter) {
      console.warn('Email transporter not configured. Skipping email send.');
      return;
    }

    const fromEmail = process.env.ZEPTOMAIL_FROM_EMAIL || process.env.ZEPTOMAIL_BOUNCE_ADDRESS || 'no-reply@yatindia.com';
    // All form submissions go to admin email - NOT to the user
    const toEmail = process.env.ZEPTOMAIL_TO_EMAIL || 'info@yatindia.com';
    // Use Cloudinary logo URL if available, otherwise use public folder
    const logoUrl = process.env.LOGO_URL || process.env.CLOUDINARY_LOGO_URL || 
      'https://res.cloudinary.com/dxnts57kq/image/upload/v1762870110/yatindia/images/YAT_INDIA_LOGO_UPDATED_sgdocn.png' ||
      (() => {
        const backendUrl = process.env.BACKEND_URL || process.env.API_URL || 'http://localhost:4173';
        const logoFileName = encodeURIComponent('YAT INDIA LOGO UPDATED.png');
        return `${backendUrl}/public/${logoFileName}`;
      })();

    const servicesList = projectData.services && projectData.services.length > 0
      ? projectData.services.map(s => `<li style="margin: 5px 0;">${s}</li>`).join('')
      : '<li style="margin: 5px 0;">None selected</li>';
    
    const industriesList = projectData.industries && projectData.industries.length > 0
      ? projectData.industries.map(i => `<li style="margin: 5px 0;">${i}</li>`).join('')
      : '<li style="margin: 5px 0;">None selected</li>';

    const emailContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Project Inquiry</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f0f0f0; font-family: Arial, sans-serif;">
        <div style="width: 100%; max-width: 700px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white;">
            <img src="${logoUrl}" alt="YAT India Logo" style="max-width: 200px; height: auto;" />
          </div>
          <div style="padding: 20px;">
            <h2 style="color: #333; margin-top: 0;">New Project Inquiry Submission</h2>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #667eea; margin-top: 0;">Contact Information</h3>
              <div style="margin-bottom: 10px;"><strong>Name:</strong> ${projectData.name}</div>
              <div style="margin-bottom: 10px;"><strong>Email:</strong> ${projectData.email}</div>
              <div style="margin-bottom: 10px;"><strong>Phone:</strong> ${projectData.phone}</div>
              ${projectData.company ? `<div style="margin-bottom: 10px;"><strong>Company:</strong> ${projectData.company}</div>` : ''}
            </div>

            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #667eea; margin-top: 0;">Services Required</h3>
              <ul style="margin: 10px 0; padding-left: 20px;">${servicesList}</ul>
              ${projectData.customService ? `<div style="margin-top: 10px;"><strong>Custom Service:</strong> ${projectData.customService}</div>` : ''}
            </div>

            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #667eea; margin-top: 0;">Industries</h3>
              <ul style="margin: 10px 0; padding-left: 20px;">${industriesList}</ul>
              ${projectData.customIndustry ? `<div style="margin-top: 10px;"><strong>Custom Industry:</strong> ${projectData.customIndustry}</div>` : ''}
            </div>

            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #667eea; margin-top: 0;">Timeline</h3>
              <div>${projectData.timeline}</div>
            </div>

            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #667eea; margin-top: 0;">Project Description</h3>
              <div style="white-space: pre-wrap; color: #666;">${projectData.projectDescription}</div>
            </div>

            ${projectData.additionalQuestions ? `
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #667eea; margin-top: 0;">Additional Questions</h3>
              <div style="white-space: pre-wrap; color: #666;">${projectData.additionalQuestions}</div>
            </div>
            ` : ''}

            ${projectData.howDidYouHear ? `
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #667eea; margin-top: 0;">How did they hear about us</h3>
              <div>${projectData.howDidYouHear}</div>
            </div>
            ` : ''}

            ${projectData.previousExperience ? `
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #667eea; margin-top: 0;">Previous Experience</h3>
              <div style="white-space: pre-wrap; color: #666;">${projectData.previousExperience}</div>
            </div>
            ` : ''}

            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd;">
              <small style="color: #999;">Submitted at: ${new Date().toLocaleString()}</small>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: fromEmail,
      to: toEmail,
      subject: `New Project Inquiry - ${projectData.name}`,
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Project email sent successfully to:', toEmail);
  } catch (error) {
    console.error('❌ Error sending project email:', error.message);
    if (error.response) {
      console.error('ZeptoMail API response:', error.response);
    }
    // Don't throw error - we don't want email failures to break form submission
  }
};

/**
 * Send email notification for career application submission
 */
export const sendCareerEmail = async (careerData, resumePath = null) => {
  try {
    const transporter = getTransporter();
    if (!transporter) {
      console.warn('Email transporter not configured. Skipping email send.');
      return;
    }

    const fromEmail = process.env.ZEPTOMAIL_FROM_EMAIL || process.env.ZEPTOMAIL_BOUNCE_ADDRESS || 'no-reply@yatindia.com';
    // All form submissions go to admin email - NOT to the user
    const toEmail = process.env.ZEPTOMAIL_TO_EMAIL || 'info@yatindia.com';
    // Use Cloudinary logo URL if available, otherwise use public folder
    const logoUrl = process.env.LOGO_URL || process.env.CLOUDINARY_LOGO_URL || 
      'https://res.cloudinary.com/dxnts57kq/image/upload/v1762870110/yatindia/images/YAT_INDIA_LOGO_UPDATED_sgdocn.png' ||
      (() => {
        const backendUrl = process.env.BACKEND_URL || process.env.API_URL || 'http://localhost:4173';
        const logoFileName = encodeURIComponent('YAT INDIA LOGO UPDATED.png');
        return `${backendUrl}/public/${logoFileName}`;
      })();

    const emailContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Career Application</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f0f0f0; font-family: Arial, sans-serif;">
        <div style="width: 100%; max-width: 700px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white;">
            <img src="${logoUrl}" alt="YAT India Logo" style="max-width: 200px; height: auto;" />
          </div>
          <div style="padding: 20px;">
            <h2 style="color: #333; margin-top: 0;">New Career Application</h2>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #667eea; margin-top: 0;">Applicant Information</h3>
              <div style="margin-bottom: 10px;"><strong>Name:</strong> ${careerData.name}</div>
              <div style="margin-bottom: 10px;"><strong>Email:</strong> ${careerData.email}</div>
              <div style="margin-bottom: 10px;"><strong>Phone:</strong> ${careerData.phone}</div>
              ${careerData.position ? `<div style="margin-bottom: 10px;"><strong>Position:</strong> ${careerData.position}</div>` : ''}
              ${careerData.experience ? `<div style="margin-bottom: 10px;"><strong>Experience:</strong> ${careerData.experience}</div>` : ''}
            </div>

            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #667eea; margin-top: 0;">Message</h3>
              <div style="white-space: pre-wrap; color: #666;">${careerData.message}</div>
            </div>

            ${resumePath ? `
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #667eea; margin-top: 0;">Resume</h3>
              <div>Resume has been uploaded: <strong>${careerData.resumeFileName || 'File attached'}</strong></div>
            </div>
            ` : ''}

            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd;">
              <small style="color: #999;">Submitted at: ${new Date().toLocaleString()}</small>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: fromEmail,
      to: toEmail,
      subject: `New Career Application - ${careerData.name}${careerData.position ? ` (${careerData.position})` : ''}`,
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Career email sent successfully to:', toEmail);
  } catch (error) {
    console.error('❌ Error sending career email:', error.message);
    if (error.response) {
      console.error('ZeptoMail API response:', error.response);
    }
    // Don't throw error - we don't want email failures to break form submission
  }
};

/**
 * Send email to admin about a lead
 */
export const sendLeadEmail = async (leadData, leadType) => {
  try {
    const transporter = getTransporter();
    if (!transporter) {
      console.warn('Email transporter not configured. Skipping email send.');
      return;
    }

    const fromEmail = process.env.ZEPTOMAIL_FROM_EMAIL || process.env.ZEPTOMAIL_BOUNCE_ADDRESS || 'no-reply@yatindia.com';
    const toEmail = 'info@yatindia.com';
    const logoUrl = process.env.LOGO_URL || process.env.CLOUDINARY_LOGO_URL || 
      'https://res.cloudinary.com/dxnts57kq/image/upload/v1762870110/yatindia/images/YAT_INDIA_LOGO_UPDATED_sgdocn.png' ||
      'http://localhost:4173/public/YAT INDIA LOGO UPDATED.png';

    let emailContent = '';
    let subject = '';

    if (leadType === 'career') {
      subject = `Lead Update - Career Application: ${leadData.name}`;
      emailContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Lead Update - Career Application</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f0f0f0; font-family: Arial, sans-serif;">
          <div style="width: 100%; max-width: 700px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white;">
              <img src="${logoUrl}" alt="YAT India Logo" style="max-width: 200px; height: auto;" />
            </div>
            <div style="padding: 20px;">
              <h2 style="color: #333; margin-top: 0;">Lead Update - Career Application</h2>
              
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea;">
                <h3 style="color: #667eea; margin-top: 0;">Applicant Information</h3>
                <div style="margin-bottom: 10px;"><strong>Name:</strong> ${leadData.name}</div>
                <div style="margin-bottom: 10px;"><strong>Email:</strong> ${leadData.email}</div>
                <div style="margin-bottom: 10px;"><strong>Phone:</strong> ${leadData.phone}</div>
                ${leadData.position ? `<div style="margin-bottom: 10px;"><strong>Position:</strong> ${leadData.position}</div>` : ''}
                ${leadData.experience ? `<div style="margin-bottom: 10px;"><strong>Experience:</strong> ${leadData.experience}</div>` : ''}
                <div style="margin-bottom: 10px;"><strong>Status:</strong> <span style="text-transform: capitalize; color: #667eea;">${leadData.status}</span></div>
              </div>

              ${leadData.description ? `
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea;">
                <h3 style="color: #667eea; margin-top: 0;">Notes/Description</h3>
                <div style="white-space: pre-wrap; color: #666;">${leadData.description}</div>
              </div>
              ` : ''}

              ${leadData.message ? `
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea;">
                <h3 style="color: #667eea; margin-top: 0;">Original Message</h3>
                <div style="white-space: pre-wrap; color: #666;">${leadData.message}</div>
              </div>
              ` : ''}

              <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd;">
                <small style="color: #999;">Updated at: ${new Date().toLocaleString()}</small>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (leadType === 'contact') {
      subject = `Lead Update - Contact Request: ${leadData.name}`;
      emailContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Lead Update - Contact Request</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f0f0f0; font-family: Arial, sans-serif;">
          <div style="width: 100%; max-width: 700px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white;">
              <img src="${logoUrl}" alt="YAT India Logo" style="max-width: 200px; height: auto;" />
            </div>
            <div style="padding: 20px;">
              <h2 style="color: #333; margin-top: 0;">Lead Update - Contact Request</h2>
              
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea;">
                <h3 style="color: #667eea; margin-top: 0;">Contact Information</h3>
                <div style="margin-bottom: 10px;"><strong>Name:</strong> ${leadData.name}</div>
                <div style="margin-bottom: 10px;"><strong>Email:</strong> ${leadData.email}</div>
                <div style="margin-bottom: 10px;"><strong>Phone:</strong> ${leadData.phone}</div>
                <div style="margin-bottom: 10px;"><strong>Status:</strong> <span style="text-transform: capitalize; color: #667eea;">${leadData.status}</span></div>
              </div>

              ${leadData.description ? `
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea;">
                <h3 style="color: #667eea; margin-top: 0;">Notes/Description</h3>
                <div style="white-space: pre-wrap; color: #666;">${leadData.description}</div>
              </div>
              ` : ''}

              <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd;">
                <small style="color: #999;">Updated at: ${new Date().toLocaleString()}</small>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (leadType === 'project') {
      subject = `Lead Update - Project Inquiry: ${leadData.name}`;
      const servicesList = leadData.services && leadData.services.length > 0
        ? leadData.services.map(s => `<li style="margin: 5px 0;">${s}</li>`).join('')
        : '<li style="margin: 5px 0;">None selected</li>';
      
      emailContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Lead Update - Project Inquiry</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f0f0f0; font-family: Arial, sans-serif;">
          <div style="width: 100%; max-width: 700px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white;">
              <img src="${logoUrl}" alt="YAT India Logo" style="max-width: 200px; height: auto;" />
            </div>
            <div style="padding: 20px;">
              <h2 style="color: #333; margin-top: 0;">Lead Update - Project Inquiry</h2>
              
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea;">
                <h3 style="color: #667eea; margin-top: 0;">Contact Information</h3>
                <div style="margin-bottom: 10px;"><strong>Name:</strong> ${leadData.name}</div>
                <div style="margin-bottom: 10px;"><strong>Email:</strong> ${leadData.email}</div>
                <div style="margin-bottom: 10px;"><strong>Phone:</strong> ${leadData.phone}</div>
                ${leadData.company ? `<div style="margin-bottom: 10px;"><strong>Company:</strong> ${leadData.company}</div>` : ''}
                <div style="margin-bottom: 10px;"><strong>Status:</strong> <span style="text-transform: capitalize; color: #667eea;">${leadData.status}</span></div>
              </div>

              ${leadData.description ? `
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea;">
                <h3 style="color: #667eea; margin-top: 0;">Notes/Description</h3>
                <div style="white-space: pre-wrap; color: #666;">${leadData.description}</div>
              </div>
              ` : ''}

              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea;">
                <h3 style="color: #667eea; margin-top: 0;">Services Required</h3>
                <ul style="margin: 10px 0; padding-left: 20px;">${servicesList}</ul>
              </div>

              ${leadData.projectDescription ? `
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea;">
                <h3 style="color: #667eea; margin-top: 0;">Project Description</h3>
                <div style="white-space: pre-wrap; color: #666;">${leadData.projectDescription}</div>
              </div>
              ` : ''}

              <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd;">
                <small style="color: #999;">Updated at: ${new Date().toLocaleString()}</small>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    const mailOptions = {
      from: fromEmail,
      to: toEmail,
      subject: subject,
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Lead email sent successfully to:', toEmail);
  } catch (error) {
    console.error('❌ Error sending lead email:', error.message);
    if (error.response) {
      console.error('ZeptoMail API response:', error.response);
    }
    throw error; // Re-throw for controller to handle
  }
};
