import { fetchNotes } from '@/lib/api';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import Notes from './Notes.client';
import { Metadata } from 'next';

interface NotesPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: NotesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = slug[0] === 'all' ? 'All notes' : slug[0];

  return {
    title: category,
    description: `Notes from category: ${category}`,
    openGraph: {
      title: 'NoteHub',
      description:
        'NoteHub is a simple and efficient application designed for managing personal notes. It helps keep your thoughts organized and accessible in one place, whether you are at home or on the go.',
      url: `https://notehub.com/`,
      images: {
        url: `https://ac.goit.global/fullstack/react/notehub-og-meta.jpg`,
        alt: 'NoteHub',
        width: 1200,
        height: 630,
      },
    },
  };
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
