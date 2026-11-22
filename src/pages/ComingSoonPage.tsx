import { Clock } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';

interface ComingSoonPageProps {
  title: string;
  milestone: string;
}

/** Placeholder for tabs whose screens are built in later milestones. */
export function ComingSoonPage({ title, milestone }: ComingSoonPageProps) {
  return (
    <>
      <PageHeader title={title} />
      <EmptyState
        icon={<Clock size={28} />}
        title={`Built in ${milestone}`}
        description="Navigation, sign-in and community context for this screen are already in place."
      />
    </>
  );
}
