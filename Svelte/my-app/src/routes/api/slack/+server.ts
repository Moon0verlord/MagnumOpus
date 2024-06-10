import {SLACK_WEBHOOK} from "$env/static/private";
import {GetPort, GetUserAdminStatus} from "$lib/server/db/dbComposables";
import * as dotenv from 'dotenv';

const isEmpty = function(text: string): boolean {
    return text === null || text.match(/^ *$/) !== null;
};


/**
 * @openapi
 * /api/slack:
 *   post:
 *     summary: Send a message to Slack
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               portId:
 *                 type: string
 *               userId:
 *                 type: string
 *               priority:
 *                 type: string
 *               message:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: No slack webhook is set
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
// @ts-ignore
export const POST = async ({ request }) => {
    const body = await request.json();
    let response : Response
    dotenv.config();
    if (!process.env.SLACK_WEBHOOK) {
        console.log('SLACK_WEBHOOK environment variable does not exist');
    } else {
        if ('portId' in body && 'userId' in body && 'priority' in body) {
            const portInfo = (await GetPort(body.portId)).pop();
            const userInfo = (await GetUserAdminStatus(body.userId)).pop();
            const portUser = (await GetUserAdminStatus(portInfo!.usedBy!)).pop();
            const now = new Date();
            const date = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
            const time = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}`;
            response = await fetch(SLACK_WEBHOOK, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: body.message,
                    blocks: [
                        {
                            "type": "header",
                            "text": {
                                "type": "plain_text",
                                "text": "Port Request",
                                "emoji": true
                            }
                        },
                        {
                            "type": "context",
                            "elements": [
                                {
                                    "type": "mrkdwn",
                                    "text": `*${portInfo?.displayName}*`
                                }
                            ]
                        },
                        {
                            "type": "context",
                            "elements": [
                                {
                                    "type": "mrkdwn",
                                    "text": `:alarm_clock: Made at: ${date} / ${time}`
                                }
                            ]
                        },
                        {
                            "type": "divider"
                        },
                        {
                            "type": "section",
                            "fields": [
                                {
                                    "type": "mrkdwn",
                                    "text": "*Port Request by:*"
                                },
                                {
                                    "type": "mrkdwn",
                                    "text": `${userInfo?.name}`
                                },
                                {
                                    "type": "mrkdwn",
                                    "text": "*Current Port Holder:*"
                                },
                                {
                                    "type": "mrkdwn",
                                    "text": `${portUser?.name}`
                                },
                                {
                                    "type": "mrkdwn",
                                    "text": `:large_orange_diamond: *Urgency*: ${body.priority}`
                                }
                            ]
                        },
                        {
                            "type": "divider"
                        },
                        {
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": "*Message*"
                            }
                        },
                        {
                            "type": "rich_text",
                            "elements": [
                                {
                                    "type": "rich_text_section",
                                    "elements": [
                                        {
                                            "type": "text",
                                            "text": `${(isEmpty(body.description) ? "No message given with request." : body.description)}`
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "divider"
                        },
                        {
                            "type": "actions",
                            "elements": [
                                {
                                    "type": "button",
                                    "text": {
                                        "type": "plain_text",
                                        "text": "Visit My Ports Page",
                                        "emoji": true
                                    },
                                    "value": "click_me_123",
                                    "url": "http://localhost:5173/stations",
                                    "action_id": "button-action"
                                }
                            ]
                        }
                    ]
                }),
            })
        } else {
            response = await fetch(SLACK_WEBHOOK, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: body.message,
                }),
            });
        }
        if (response.ok) {
            return new Response(JSON.stringify({message: "Success"}), {status: 201});
        }
        return new Response(JSON.stringify({message: "Failed"}), {status: 400});
    }
    return new Response(JSON.stringify({message: "No slack webhook is set."}), {status: 500});
}