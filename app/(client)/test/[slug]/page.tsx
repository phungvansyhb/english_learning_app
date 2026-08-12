import TestRunner from '@/components/dashboard/test/test-runner';
import { getTest, TestPart } from '@/lib/test-data';
export default async function TestDetailPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ parts?: string }> }) { const { slug } = await params; const query = await searchParams; const selectedParts = (query.parts?.split(',').filter(Boolean) ?? []) as TestPart[]; const test = getTest(slug); return <TestRunner title={test.title} selectedParts={selectedParts} />; }
