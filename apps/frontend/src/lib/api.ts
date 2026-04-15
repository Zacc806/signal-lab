const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export type ScenarioType = 'success' | 'validation_error' | 'system_error' | 'slow_request' | 'teapot';

export interface ScenarioRun {
  id: string;
  type: ScenarioType;
  status: string;
  duration: number | null;
  createdAt: string;
}

export async function runScenario(payload: { type: ScenarioType; name?: string }) {
  const response = await fetch(`${API_BASE_URL}/api/scenarios/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message ?? 'Failed to run scenario');
  }
  return data;
}

export async function fetchScenarioRuns(): Promise<ScenarioRun[]> {
  const response = await fetch(`${API_BASE_URL}/api/scenarios`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Failed to fetch scenario runs');
  }
  return response.json();
}
