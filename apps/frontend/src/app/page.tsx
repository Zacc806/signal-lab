'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { fetchScenarioRuns, runScenario, ScenarioType } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type FormValues = {
  type: ScenarioType;
  name?: string;
};

const statusVariant: Record<string, 'success' | 'warning' | 'error' | 'neutral'> = {
  completed: 'success',
  teapot: 'warning',
  error: 'error',
};

export default function Home() {
  const queryClient = useQueryClient();
  const form = useForm<FormValues>({
    defaultValues: {
      type: 'success',
      name: '',
    },
  });

  const runsQuery = useQuery({
    queryKey: ['scenario-runs'],
    queryFn: fetchScenarioRuns,
    refetchInterval: 5000,
  });

  const runMutation = useMutation({
    mutationFn: runScenario,
    onSuccess: (data) => {
      toast.success(`Scenario done: ${data.status}`);
      queryClient.invalidateQueries({ queryKey: ['scenario-runs'] });
      form.reset({ type: form.getValues('type'), name: '' });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Scenario failed';
      toast.error(message);
      queryClient.invalidateQueries({ queryKey: ['scenario-runs'] });
    },
  });

  const onSubmit = form.handleSubmit((values) => runMutation.mutate(values));

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 font-sans sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Signal Lab</h1>
      <p className="text-sm text-zinc-600">Run scenarios and verify signals in Prometheus, Loki, Grafana, and Sentry.</p>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Run Scenario</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={onSubmit}>
              <select
                className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm"
                {...form.register('type')}
              >
                <option value="success">success</option>
                <option value="validation_error">validation_error</option>
                <option value="system_error">system_error</option>
                <option value="slow_request">slow_request</option>
                <option value="teapot">teapot</option>
              </select>
              <Input placeholder="Optional scenario name" {...form.register('name')} />
              <Button disabled={runMutation.isPending} type="submit">
                {runMutation.isPending ? 'Running...' : 'Run Scenario'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Run History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {runsQuery.data?.map((run) => (
                <div className="flex items-center justify-between rounded-md border p-3" key={run.id}>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusVariant[run.status] ?? 'neutral'}>{run.status}</Badge>
                    <span className="text-sm font-medium">{run.type}</span>
                  </div>
                  <div className="text-right text-xs text-zinc-600">
                    <div>{run.duration ?? 0} ms</div>
                    <div>{new Date(run.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              ))}
              {runsQuery.data?.length === 0 && <p className="text-sm text-zinc-600">No runs yet.</p>}
              {runsQuery.isLoading && <p className="text-sm text-zinc-600">Loading runs...</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Observability Links</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1 text-sm">
            <li>
              Grafana:{' '}
              <a className="text-blue-600 underline" href="http://localhost:3101" target="_blank" rel="noreferrer">
                http://localhost:3101
              </a>
            </li>
            <li>Prometheus metrics: <code>http://localhost:3001/metrics</code></li>
            <li>Loki query: <code>{'{app="signal-lab"}'}</code></li>
            <li>Sentry: check project dashboard for system_error exceptions.</li>
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}
