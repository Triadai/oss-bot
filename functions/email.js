"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const mailgun = require("mailgun-js");
/**
 * Get a new email client that uses Mailgun.
 * @param {string} key Mailgun API key.
 * @param {string} domain Mailgun sender domain.
 */
class EmailClient {
    constructor(key, domain) {
        // Mailgun email sender
        this.sender = mailgun({
            apiKey: key,
            domain: domain
        });
    }
    /**
     * Send a new email.
     */
    sendEmail(recipient, subject, body) {
        const data = {
            from: "Firebase OSS Bot <firebase-oss-bot@ossbot.computer>",
            to: recipient,
            subject: subject,
            html: body
        };
        console.log("Sending email: ", JSON.stringify(data));
        // Return a promise for the email
        return new Promise((resolve, reject) => {
            this.sender.messages().send(data, (error, body) => {
                if (error) {
                    console.log("Email Error: " + error);
                    reject(error);
                }
                else {
                    console.log("Send Email Body: " + JSON.stringify(body));
                    resolve(body);
                }
            });
        });
    }
    /**
     * Send an emails styled like a Github update.
     */
    sendStyledEmail(recipient, subject, header, body_html, link, action) {
        const smartmail_markup = this.getSmartmailMarkup(link, action);
        const body = `
    <html>
      <body>
        <p>
          <a href="${link}">${link}</a>
        </p>

        <p>
          <b>${header}</b>
        </p>

        <div>
          ${body_html}
        </div>

        ___

        <p>(This email is automatically generated, do not reply)</p>

        ${smartmail_markup}
      <body>
    </html>`;
        return this.sendEmail(recipient, subject, body);
    }
    /**
     * Invisible email markup to add action in Gmail.
     *
     * Note: Get registered with google.
     * https://developers.google.com/gmail/markup/registering-with-google
     */
    getSmartmailMarkup(url, title) {
        const email_markup = `
      <div itemscope itemtype="http://schema.org/EmailMessage">
        <div itemprop="potentialAction" itemscope itemtype="http://schema.org/ViewAction">
          <link itemprop="url" href="${url}"/>
          <meta itemprop="name" content="${title}"/>
        </div>
        <meta itemprop="description" content="${title}" />
      </div>`;
        return email_markup;
    }
}
exports.EmailClient = EmailClient;
//# sourceMappingURL=email.js.map