import { type FC } from "react";

type MqlProps = {
  pipeline: any[] | null | undefined;
};

export const Mql: FC<MqlProps> = ({ pipeline }) => {
  if (!pipeline || pipeline.length === 0) {
    return null;
  }

  const format = (p: any[]) => {
    const pipelineCopy = JSON.parse(JSON.stringify(p));

    if (pipelineCopy[0]?.$vectorSearch?.queryVector && Array.isArray(pipelineCopy[0].$vectorSearch.queryVector)) {
      // present as bit string
      pipelineCopy[0].$vectorSearch.queryVector = pipelineCopy[0].$vectorSearch.queryVector.join('');
    }

    return JSON.stringify(pipelineCopy, null, 2);
  };

  return (
    <div className="w-[800px] bg-black p-4 overflow-y-auto">
      <pre className="font-mono text-md text-green-400 whitespace-pre-wrap break-words">{format(pipeline)}</pre>
    </div>
  );
};