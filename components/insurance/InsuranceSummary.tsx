import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SummaryData {
  car: string;
  home: string;
  life: string;
}

interface InsuranceSummaryProps {
  summaries: SummaryData;
  isLoading?: boolean;
}

export function InsuranceSummary({
  summaries,
  isLoading = false,
}: InsuranceSummaryProps) {
  const formatMarkdown = (content: string) => {
    const lines = content.split('\n');

    const renderLine = (line: string, index: number) => {
      // Main headers (###)
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className='text-xl font-bold text-primary mb-4'>
            {line.replace('### ', '')}
          </h3>
        );
      }

      // Sub headers (####)
      if (line.startsWith('#### ')) {
        return (
          <h4 key={index} className='text-lg font-semibold  mt-6 mb-2'>
            {line.replace('#### ', '')}
          </h4>
        );
      }

      // Handle lines with trailing :**
      if (line.match(/\*\* :\*\*$/)) {
        const text = line.replace(/\*\* :\*\*$/, '').replace(/^- \*\*/, '');
        return (
          <div key={index} className='font-medium ml-4'>
            {text}:
          </div>
        );
      }

      // Main bullet points with bold
      if (line.startsWith('- **')) {
        const [title, ...rest] = line.split('**: ');
        return (
          <div key={index} className='ml-4 mb-2'>
            <span className='font-medium'>{title.replace('- **', '')}:</span>
            <span className='ml-1'>{rest.join('')}</span>
          </div>
        );
      }

      // Sub bullet points with bold wrapping
      if (line.trim().startsWith('•') && line.includes('*')) {
        const text = line.replace(/^\s*• \*\*/, '').replace(/\*\*$/, '');
        return (
          <div key={index} className='ml-8 text-sm font-medium'>
            {text}
          </div>
        );
      }

      // Regular sub bullet points
      if (line.trim().startsWith('•')) {
        return (
          <div key={index} className='ml-8 text-sm '>
            {line.trim()}
          </div>
        );
      }

      // Regular text
      if (line.trim()) {
        return (
          <p key={index} className='ml-4 text-sm'>
            {line}
          </p>
        );
      }

      return null;
    };

    return (
      <div className='space-y-2'>
        {lines.map((line, index) => renderLine(line, index))}
      </div>
    );
  };
  if (isLoading) {
    return (
      <Card className='mt-6'>
        <CardHeader>
          <CardTitle>Genererer analyse...</CardTitle>
          <CardDescription>
            Vennligst vent mens vi analyserer forsikringsbehovet
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const hasSummaries = summaries.car || summaries.home || summaries.life;

  if (!hasSummaries) {
    return null;
  }

  return (
    <Card className='mt-6'>
      <CardHeader>
        <CardTitle>Forsikringsanalyse</CardTitle>
        <CardDescription>
          Detaljert analyse og anbefalinger for valgte forsikringer
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[600px] pr-4'>
          <div className='space-y-8'>
            {summaries.car && (
              <div className='rounded-lg border bg-card p-6'>
                {formatMarkdown(summaries.car)}
              </div>
            )}

            {summaries.home && (
              <div className='rounded-lg border bg-card p-6 mt-6'>
                {formatMarkdown(summaries.home)}
              </div>
            )}

            {summaries.life && (
              <div className='rounded-lg border bg-card p-6 mt-6'>
                {formatMarkdown(summaries.life)}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
