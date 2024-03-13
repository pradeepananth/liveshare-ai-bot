// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { MessageFactory, CardFactory, MemoryStorage, TurnContext } from 'botbuilder';
import SampleAdaptiveCard from '../resources/sampleAdaptiveWithFullWidth.json';
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import { Application, DefaultConversationState, TurnState } from '@microsoft/teams-ai';

const deploymentId = "TestingTeamsBots";
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ConversationState extends DefaultConversationState {
    lightsOn: boolean;
}
type ApplicationTurnState = TurnState<ConversationState>;

export const getApp = (planner: any) => {
    const storage = new MemoryStorage();    
    const app = new Application<ApplicationTurnState>({
    storage,
    ai: {
        planner
    }
    });

    app.ai.action('GetOnCallNotes', async (context: TurnContext) => {
        await context.sendActivity({ attachments: [SendSubmitAIQuery()] });
        return `On call notes received.`;
    });

    app.adaptiveCards.actionSubmit('AICard', async (context: TurnContext) => {
        if (typeof context.activity.value === "object") {
            switch (context.activity.value.verb) {
                case "AICard":
                    await sendChatGptResponseIfSubmitAction(context);
                    break;
                default:
                    break;
            }
        } else {
        await context.sendActivity('I do not understand that command.');
        }
    });

    return app;
};

 /**
    * Sends Sample Adaptive Card For AI query input
    */
 const SendSubmitAIQuery = () => {
    return CardFactory.adaptiveCard(SampleAdaptiveCard);
}

const sendChatGptResponseIfSubmitAction = async (context: TurnContext) => {
    const client = new OpenAIClient(process.env.AZURE_OPENAI_ENDPOINT!, new AzureKeyCredential(process.env.AZURE_OPENAI_KEY!));
    const events = await client.streamChatCompletions(
        deploymentId,
        [{ role: "user", content: context.activity.value.multilineInputId }],
        { maxTokens: 128 }
    );
    const resArray = [];
    let isFirstActivity = true;
    let oldActivityId = "";
    for await (const event of events) {
        for (const choice of event.choices) {
            resArray.push(choice.delta?.content);
            if (isFirstActivity) {
                let activityText = resArray.join(" ");
                if (activityText) {
                    const firstActivity = MessageFactory.text(activityText);
                    const response = await context.sendActivity(firstActivity);
                    oldActivityId = response!.id;
                    isFirstActivity = false;
                }
            } else {
                if (resArray.length % 7 === 0) {
                    await streamUpdates(resArray, oldActivityId, context);
                }
            }
        }
    }
    await streamUpdates(resArray, oldActivityId, context);
};

const streamUpdates = async (resArray: any[], oldActivityId: string | undefined, context: TurnContext) => {
    let newActivity = MessageFactory.text(resArray.join(" "));
    newActivity.id = oldActivityId;
    await context.updateActivity(newActivity); 
};