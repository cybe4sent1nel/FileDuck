import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

const GITHUB_OWNER = process.env.GITHUB_ISSUE_OWNER || 'cybe4sent1nel';
const GITHUB_REPO = process.env.GITHUB_ISSUE_REPO || 'FileDuck';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { title, description, category, email } = req.body;

        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' });
        }

        const issueBody = `
**Category:** ${category || 'Uncategorized'}
**Reported by:** ${email || 'Anonymous'}
**Date:** ${new Date().toISOString()}

---

**Description:**
${description}
    `.trim();

        const response = await octokit.issues.create({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            title: `[User Report] ${title}`,
            body: issueBody,
            labels: ['user-report', category].filter(Boolean) as string[],
        });

        return res.status(201).json({
            success: true,
            issueUrl: response.data.html_url,
        });
    } catch (error: any) {
        console.error('Error reporting issue:', error);
        return res.status(500).json({
            error: 'Failed to report issue to GitHub',
            details: error.message,
        });
    }
}

