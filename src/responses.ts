// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

/*
All of these responses where generated by GPT using a prompt similar to:

```
Here's a JavaScript string literal template:

`I couldn't find a ${item} on your ${list} list.`

Create a JavaScript array with 7 variations of the template.
The variations should be helpful, creative, clever, and very friendly.
The variations should always use the back tick `` syntax.
The variations should always include ${item} and ${list} variables.
```

7 variations were asked for so that we can remove the 2 we like the least.
*/

export function getOnCallNotesInitialValue(): string {
    return (
        getRandomResponse([
            `On call Notes for 1/3, session 7 PM - 12 AM: 
            1 . 7 : 00 PM - 8 : 00 PM : Escalated issue with application to development team . 
            2 . 8 : 00 PM - 9 : 00 PM : Provided remote support to user experiencing login issues . 
            3 . 9 : 00 PM - 10 : 00 PM : Conduct ed system updates and maintenance . 
            4 . 10 : 00 PM - 11 : 00 PM : Performed routine backups and testing . 
            5 . 11 : 00 PM - 12 : 00 AM : Monitored system performance and resolved minor issues.`,
        ]));
}

/**
 * Responds when an unknown action is called
 * @param {string} action The action being performed
 * @returns {string} the response
 */
export function unknownAction(action: string): string {
    return getRandomResponse([
        `I'm sorry, I'm not sure how to ${action}.`,
        `I don't know the first thing about ${action}.`,
        `I'm not sure I'm the best person to help with ${action}.`,
        `I'm still learning about ${action}, but I'll try my best.`,
        `I'm afraid I'm not experienced enough with ${action}.`
    ]);
}

/**
 * Returns a string indicating that the bot cannot help with the current topic.
 * @returns {string} A string indicating that the bot cannot help with the current topic.
 */
export function offTopic(): string {
    return getRandomResponse([
        `I'm sorry, I'm not sure I can help you with that.`,
        `I'm sorry, I'm afraid I'm not allowed to talk about such things.`,
        `I'm sorry, I'm not sure I'm the right person to help you with that.`,
        `I wish I could help you with that, but it's not something I can talk about.`,
        `I'm sorry, I'm not allowed to discuss that topic.`
    ]);
}

/**
 * Returns a random response from an array of responses.
 * @param {string[]} responses - An array of string responses.
 * @returns {string} A random response from the array.
 */
function getRandomResponse(responses: string[]): string {
    const i = Math.floor(Math.random() * (responses.length - 1));
    return responses[i];
}
