import { useState, useRef, useEffect, useCallback } from 'react';

const SpeechRecognitionAPI =
    typeof window !== 'undefined' &&
    ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

interface UseSpeechOptions {
    lang?: string;
    continuous?: boolean;
}

export function useSpeech(options: UseSpeechOptions = { lang: 'en-US', continuous: false }) {
    const [transcript, setTranscript] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (!SpeechRecognitionAPI) {
            setError('Browser_not_supported');
            return;
        }

        const recognition = new SpeechRecognitionAPI();
        recognition.lang = options.lang;
        recognition.continuous = options.continuous;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsRecording(true);
            setError(null);
        };

        recognition.onresult = (event: any) => {
            // Lấy kết quả text cuối cùng
            const text = event.results[event.results.length - 1][0].transcript;
            setTranscript(text);
        };

        recognition.onerror = (event: any) => {
            setError(event.error);
            setIsRecording(false);
        };

        recognition.onend = () => {
            setIsRecording(false);
        };

        recognitionRef.current = recognition;

        // Cleanup khi component unmount
        return () => {
            recognition.stop();
        };
    }, [options.lang, options.continuous]);

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isRecording) {
            setTranscript(''); // Clear text cũ khi bắt đầu thu âm mới
            try {
                recognitionRef.current.start();
            } catch (err) {
                console.error('Lỗi khi bắt đầu thu âm:', err);
            }
        }
    }, [isRecording]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isRecording) {
            recognitionRef.current.stop();
        }
    }, [isRecording]);

    const resetTranscript = useCallback(() => {
        setTranscript('');
    }, []);

    return {
        transcript,
        isRecording,
        error,
        isSupported: !!SpeechRecognitionAPI,
        startListening,
        stopListening,
        resetTranscript
    };
}