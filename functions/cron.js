"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
// Message for closing stale issues
const STALE_ISSUE_MSG = "It's been a while since anyone updated this pull request so I am going to close it. " +
    "Please @mention a repo owner if you think this is a mistake!";
/**
 * Create a new handler for cron-style tasks.
 * @param {GithubClient} gh_client client for accessing Github.
 */
class CronHandler {
    constructor(gh_client) {
        this.gh_client = gh_client;
    }
    /**
     * Handle a cleanup cycle for a particular repo.
     */
    handleCleanup(org, name, expiry) {
        return this.gh_client.getOldPullRequests(org, name, expiry).then(res => {
            const promises = [];
            for (const pr of res) {
                console.log("Expired PR: ", pr);
                // Add a comment saying why we are closing this
                const addComment = this.gh_client.addComment(org, name, pr.number, STALE_ISSUE_MSG);
                // Close the pull request
                const closePr = this.gh_client.closeIssue(org, name, pr.number);
                promises.push(addComment);
                promises.push(closePr);
            }
            return Promise.all(promises);
        });
    }
}
exports.CronHandler = CronHandler;
//# sourceMappingURL=cron.js.map