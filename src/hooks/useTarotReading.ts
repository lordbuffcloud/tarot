import { useState } from 'react';
import { useCompletion } from 'ai/react';
import { saveReading } from '../lib/readingHistory';
import { allCardsData } from '../lib/allCardsData';
import type { TarotSpread } from '../lib/tarotSpreadTypes';
import type { SpreadCard, InterpretationRequest, FullCardType } from '../lib/tarot-types';

export type ReadingStep =
    'welcome' |
    'ask_question' |
    'set_intent' |
    'spread_selection' |
    'card_input' |
    'interpretation' |
    'history';

export interface DigitallySelectedCard {
    card_id: string;
    name: string;
    is_reversed: boolean;
}

const mysticWisdom = [
    "The threads of fate are ever-weaving...",
    "Listen closely to the whispers of the cosmos...",
    "Patience, seeker, the vision crystallizes...",
    "Ancient energies stir in response to your query...",
    "The Oracle gazes into the starlight for you...",
];

export function useTarotReading() {
    const [currentStep, setCurrentStep] = useState<ReadingStep>('welcome');
    const [userQuestion, setUserQuestion] = useState<string>('');
    const [chosenSpread, setChosenSpread] = useState<TarotSpread | null>(null);
    const [requestDataForApi, setRequestDataForApi] = useState<Partial<InterpretationRequest>>({});
    const [currentMysticMessage, setCurrentMysticMessage] = useState('');

    const {
        completion: interpretation,
        complete,
        isLoading: isAiLoading,
        error: aiError,
        setCompletion
    } = useCompletion({
        api: '/api/interpret',
        onFinish: (prompt: string, completionResult: string) => {
            // Save reading to history
            if (chosenSpread && requestDataForApi.selected_cards && requestDataForApi.question) {
                try {
                    const drawnCards: SpreadCard[] = requestDataForApi.selected_cards.map((sc) => {
                        const cardInfo = allCardsData.find(card => card.id === sc.card_id);
                        const fullCard: FullCardType = {
                            id: sc.card_id,
                            name: sc.name,
                            imagePath: cardInfo?.imagePath || '',
                        };
                        // Calculate index if possible or use default behavior (not easily available in map here without position context from caller)
                        // simplified for storage:
                        return {
                            card: fullCard,
                            is_reversed: sc.is_reversed,
                            position_name: "Card", // Placeholder, ideally specific position
                            position_description: ""
                        };
                    });

                    // Re-map with correct positions based on spread
                    const finalCards: SpreadCard[] = drawnCards.map((dc, index) => ({
                        ...dc,
                        position_name: chosenSpread.card_positions[index]?.name || `Card ${index + 1}`,
                        position_description: chosenSpread.card_positions[index]?.description,
                    }));

                    saveReading({
                        question: requestDataForApi.question,
                        spread: chosenSpread,
                        cards: finalCards,
                        interpretation: completionResult,
                    });
                } catch (historyError) {
                    console.error('Failed to save reading to history:', historyError);
                }
            }
        }
    });

    const handleNextStep = (nextStep: ReadingStep) => {
        setCurrentStep(nextStep);

        if (nextStep === 'welcome') {
            setUserQuestion('');
            setChosenSpread(null);
            setCompletion('');
            setRequestDataForApi({});
            setCurrentMysticMessage('');
        }

        if (nextStep === 'interpretation' && isAiLoading) {
            setCurrentMysticMessage(mysticWisdom[Math.floor(Math.random() * mysticWisdom.length)]);
        }
    };

    const handleQuestionSubmitted = (question: string) => {
        setUserQuestion(question);
        handleNextStep('set_intent');
    };

    const handleIntentSet = () => {
        handleNextStep('spread_selection');
    };

    const handleSpreadSelected = (spread: TarotSpread) => {
        setChosenSpread(spread);
        handleNextStep('card_input');
    };

    const handleReadingReadyForInterpretation = async (
        questionFromInput: string,
        data: { selectedCards?: DigitallySelectedCard[] }
    ) => {
        setUserQuestion(questionFromInput);

        if (!questionFromInput.trim() || !chosenSpread || !data.selectedCards || data.selectedCards.length === 0) {
            return;
        }

        const selected_cards = data.selectedCards.map(card => ({
            card_id: card.card_id,
            name: card.name,
            is_reversed: card.is_reversed
        }));

        const apiRequestData: InterpretationRequest = {
            question: questionFromInput,
            selected_cards
        };

        setRequestDataForApi(apiRequestData);
        handleNextStep('interpretation');

        try {
            await complete(questionFromInput, {
                body: apiRequestData
            });
        } catch (e) {
            console.error("Failed to start completion:", e);
        }
    };

    return {
        currentStep,
        userQuestion,
        setUserQuestion,
        chosenSpread,
        setChosenSpread,
        requestDataForApi,
        setRequestDataForApi,
        currentMysticMessage,
        interpretation,
        isAiLoading,
        aiError,
        setCompletion,
        handleNextStep,
        handleQuestionSubmitted,
        handleIntentSet,
        handleSpreadSelected,
        handleReadingReadyForInterpretation
    };
}
