'use client';
import dynamic from 'next/dynamic';

const MemeCommentsWrapper = dynamic(() => import('./MemeComments'), {
  ssr: false,
});

export default MemeCommentsWrapper;
