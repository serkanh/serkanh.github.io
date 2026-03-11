import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts');

  const items = posts.map((post) => ({
    type: 'post' as const,
    title: post.data.title,
    description: post.data.description || '',
    url: `/posts/${post.id}/`,
    tags: post.data.tags || [],
    date: post.data.date.toISOString().split('T')[0],
  }));

  // Static content from other pages
  const projects = [
    {
      type: 'project' as const,
      title: 'sre-bot',
      description: 'AI-powered SRE assistant built with Google ADK for AWS cost analysis, Kubernetes operations, and operational best practices.',
      url: '/projects/',
      tags: ['python', 'google-adk', 'aws', 'kubernetes'],
      date: '',
    },
    {
      type: 'project' as const,
      title: 'cloudwatch-logs-mcp',
      description: 'MCP server for accessing AWS CloudWatch logs. Enables AI assistants to query and retrieve CloudWatch log data.',
      url: '/projects/',
      tags: ['python', 'mcp', 'aws', 'cloudwatch'],
      date: '',
    },
  ];

  const talks = [
    {
      type: 'talk' as const,
      title: 'AIOps Revolution: How iHeart Slashed Incident Response Time by 60% with Bedrock',
      description: 'AWS re:Invent 2025 — Learn how iHeartMedia leveraged Amazon Bedrock to build an AI-powered operations platform.',
      url: '/talks/',
      tags: ['aws', 'bedrock', 'aiops'],
      date: '2025-12-01',
    },
  ];

  return new Response(JSON.stringify([...items, ...projects, ...talks]), {
    headers: { 'Content-Type': 'application/json' },
  });
};
