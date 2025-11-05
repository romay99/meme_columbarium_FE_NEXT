'use client'; // ✅ 클라이언트 컴포넌트 선언

import MDEditor from '@uiw/react-md-editor';

export default function MemeMarkdown({ contents }) {
  return (
    <MDEditor.Markdown
      source={contents}
      className="prose max-w-none"
      // className="prose max-w-none dark:prose-invert"
    />
  );
}
