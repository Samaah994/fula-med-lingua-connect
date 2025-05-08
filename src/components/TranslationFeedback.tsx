
import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircleQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { FeedbackRequest, submitTranslationFeedback } from '@/services/translationService';

interface TranslationFeedbackProps {
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  translationId?: string;
}

const TranslationFeedback: React.FC<TranslationFeedbackProps> = ({
  originalText,
  translatedText,
  sourceLang,
  targetLang,
  translationId
}) => {
  const { t } = useLanguage();
  const { user } = useUser();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [comments, setComments] = useState('');
  const [rating, setRating] = useState<'positive' | 'negative' | null>(null);

  const handleQuickFeedback = async (feedbackRating: 'positive' | 'negative') => {
    try {
      const feedback: FeedbackRequest = {
        originalText,
        translatedText,
        source: sourceLang as any,
        target: targetLang as any,
        rating: feedbackRating,
        userId: user?.id,
        translationId
      };
      
      await submitTranslationFeedback(feedback);
      
      toast({
        title: t('feedbackReceived'),
        description: t('thankYouForFeedback'),
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        variant: "destructive",
        title: t('feedbackError'),
        description: t('errorSubmittingFeedback'),
      });
    }
  };

  const handleSubmitDetailedFeedback = async () => {
    if (!rating) {
      toast({
        variant: "destructive",
        title: t('selectRating'),
        description: t('pleaseSelectRatingFirst'),
      });
      return;
    }
    
    try {
      const feedback: FeedbackRequest = {
        originalText,
        translatedText,
        source: sourceLang as any,
        target: targetLang as any,
        rating,
        comments,
        userId: user?.id,
        translationId
      };
      
      await submitTranslationFeedback(feedback);
      
      setIsDialogOpen(false);
      setComments('');
      setRating(null);
      
      toast({
        title: t('feedbackReceived'),
        description: t('thankYouForDetailedFeedback'),
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        variant: "destructive",
        title: t('feedbackError'),
        description: t('errorSubmittingFeedback'),
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => handleQuickFeedback('positive')}
        className="text-green-500 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/30"
      >
        <ThumbsUp className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => handleQuickFeedback('negative')}
        className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
      >
        <ThumbsDown className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => setIsDialogOpen(true)}
        className="text-blue-500 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30"
      >
        <MessageCircleQuestion className="h-4 w-4" />
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('translationFeedback')}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex justify-center space-x-4">
              <Button 
                variant={rating === 'positive' ? 'default' : 'outline'}
                onClick={() => setRating('positive')}
                className={rating === 'positive' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                {t('accurate')}
              </Button>
              <Button 
                variant={rating === 'negative' ? 'default' : 'outline'}
                onClick={() => setRating('negative')}
                className={rating === 'negative' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                {t('inaccurate')}
              </Button>
            </div>
            <Textarea
              placeholder={t('additionalFeedback')}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSubmitDetailedFeedback}>
              {t('submit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TranslationFeedback;
