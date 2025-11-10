const Brevo = require('@getbrevo/brevo');

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

function sendEmailWithAttachmentsTo(to, subject, htmlMsg, attachmentList, callback) {
    try {
        let sendSmtpEmail = new Brevo.SendSmtpEmail({
            to: [{ email: to }],
            cc: [{ email: 'contact@parisdisneylandtransfer.com' }], 
            sender: { email: 'info@parisdisneylandtransfer.com', name: 'Paris Disneyland Transfer' },
            subject: subject,
            htmlContent: htmlMsg,
          });
          
          // Send the email
          apiInstance.sendTransacEmail(sendSmtpEmail).then(
            function(data) {
              console.log('API called successfully. Returned data:', data);
              return data;
            },
            function(error) {
              console.error('Error sending email:', error);
              return callback(error, null);
            }
          );
    } catch (error) {
        return callback(error, null);
    }
}

function sendEmailWithAttachments(to, subject, htmlMsg, attachmentList) {
    return new Promise((resolve, reject) => {
        sendEmailWithAttachmentsTo(to, subject, htmlMsg, attachmentList, function (err, data) {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    });
}

function sendEmailTo(to, subject, htmlMsg, callback) {
    try {
          const sendSmtpEmail = {
            to: [{ email: to }],
            cc: [{ email: 'contact@parisdisneylandtransfer.com' }], 
            sender: { email: 'info@parisdisneylandtransfer.com', name: 'Paris Disneyland Transfer' },
            subject: subject,
            htmlContent: htmlMsg,
          };
          
          // Send the email
          apiInstance.sendTransacEmail(sendSmtpEmail).then(
            function(data) {
              //console.log('API called successfully. Returned data:', data);
              return callback(null, data);
            },
            function(error) {
              console.error('Error sending email:', error);
              return callback(error, null);
            }
          );
    } catch (error) {
        return callback(error, null);
    }
}

function sendEmail(to, subject, htmlMsg) {
    return new Promise((resolve, reject) => {
        sendEmailTo(to, subject, htmlMsg, function (err, data) {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    });
}

module.exports = {
    sendEmailWithAttachments: sendEmailWithAttachments,
    sendEmail: sendEmail,
};
