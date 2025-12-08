import { success } from "better-auth";
import { inngest } from "./client";
import { NEWS_SUMMARY_EMAIL_PROMPT, PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompts";
import { sendWelcomeEmail } from "../nodemailer";
import { getAllUsersForNewsEmail } from "../actions/user.actions";
import { getWatchlistSymbolsByEmail } from "../actions/watchlist.actions";
import { getNews } from "../actions/finnhub.actions";
import { sendNewSummaryEmail } from "../nodemailer";

export const sendSignUpEmail = inngest.createFunction({
    id:'sign-up-email'
}, { event: 'app/user.created' },
    async ({ event, step }) => {
        const userProfile = `
        -Country: ${event.data.country}
        -Investment goals: ${event.data.investmentGoals}
        -Risk tolerance: ${event.data.riskTolerance}
        -Prefered industry: ${event.data.preferredIndustry}
        `

        const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace('{{userProfile}}', userProfile)
        
        const response = await step.ai.infer('generate-welcome-intro', {
            model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
            body: {
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: prompt }
                        ]
                    }
                ]
            }
        })

        await step.run('send-welcome-email', async () => {
            const part = response.candidates?.[0]?.content.parts?.[0];
            const introText = (part && 'text' in part ? part.text : null) || 'Thanks for joining Signalist. You now have the tools to track markets and make smarter moves.'
            
            const { data: { email, name } } = event;
            await sendWelcomeEmail({ email, name, intro: introText });
        })

        
        return {
            success: true,
            message: 'Welcome email sent successfully'
        }
    }
)

export const sendDailyNewsSummary = inngest.createFunction(
    { id: 'daily-news-summary' }, [{ event: 'app/send.daily.news' }, { cron: '0 12 * * *' }],
    async ({ step }) => {
        // Step #1: Get all users for news delivery
        const users = await step.run('get-all-users', async () => await getAllUsersForNewsEmail())
        
        if (!users || users.length === 0) return { success: false, message: "No User Found for news Email" }
        // Step #2: Fetch personalized news for each user
        const results = await step.run('fetch-user-news', async () => {
            const perUser: Array<{ user: UserForNewsEmail; articles: MarketNewsArticle[] }> = [];
            for (const user of users as UserForNewsEmail[]) {
                try {
                    const symbols = await getWatchlistSymbolsByEmail(user.email);
                    let articles = await getNews(symbols);
                    //enforce max 6 articles per user
                    articles = (articles || []).slice(0, 6);
                    //if still emplty, fallback to general
                    if (!articles || articles.length === 0) {
                        articles = await getNews();
                        articles = (articles || []).slice(0, 6);
                    }
                    perUser.push({ user, articles });
                } catch (err) {
                    console.error('daily-news-summary: Error fetching news for user', user.email, err);
                }
            }
            return perUser;
        });
        //Step #3: (placeholder) Summarize news via AI
        const userNewsSummaries: { user: User; newsContent: string | null }[] = [];

        for (const { user, news } of results) {
            try {
                const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace('{{newsData}}', JSON.stringify(news, null, 2));

                const response = await step.ai.infer(`summarize-news-${user.email}`, {
                    model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
                    body: {
                        contents: [
                            {
                                role: 'user',
                                parts: [
                                    { text: prompt }]
                            }]
                    }
                });
                const part = response.candidates?.[0]?.content.parts?.[0];
                const newsConstent = (part && 'text' in part ? part.text : null) || 'Mp market news summary not available at this time.';

                userNewsSummaries.push({ user, newsContent: newsConstent });
            } catch (e) {
                console.log('Failed to summarize news for: ', user.email);
                userNewsSummaries.push({ user, newsContent: null });
            }
        }

        //Step #4: placeholder Send emails
        await step.run('run-news-emails', async () => {
            await Promise.all(userNewsSummaries.map(async ({ user, newsContent }) => {
                if (!newsContent) return false;

                return await sendNewSummaryEmail({email: user.email, date: (new Date()).toDateString(), newsContent });
        });
        return { success: true } as const;
    }
)
