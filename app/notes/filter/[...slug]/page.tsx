import { fetchNotes } from '@/lib/api';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import Notes from './Notes.client';

interface NotesPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;
  const tag = slug[0] === 'all' ? undefined : slug[0];
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', '', 1, tag],
    queryFn: () => fetchNotes(1, '', tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Notes tag={tag} />
    </HydrationBoundary>
  );
}
