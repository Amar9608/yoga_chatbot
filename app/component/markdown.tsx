import React from 'react';


import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';

const md = new MarkdownIt();

type Props = {
  text: string;
};

const Markdown = ({ text }: Props) => {
  const safeText = typeof text === 'string' ? text : '';
  const htmlContent = md.render(safeText);
  const sanitizedContent = DOMPurify.sanitize(htmlContent);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
};

export default Markdown;
