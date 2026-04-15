import { redirect } from 'next/navigation';

export default function GrafanaPage() {
  redirect('http://localhost:3101/d/signal-lab-dashboard/signal-lab-dashboard');
}
