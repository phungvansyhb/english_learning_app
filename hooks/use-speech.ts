import { useState, useRef, useEffect, useCallback } from 'react';

type SpeechRecognitionResultEvent = {
    results: ArrayLike<{ 0: { transcript: string } }>;
};

type SpeechRecognitionErrorEvent = {
    error?: string;
};

type SpeechRecognitionInstance = {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
    onstart: (() => void) | null;
    onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
    start: () => void;
    stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

type SpeechRecognitionWindow = Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

interface UseSpeechOptions {
    lang?: string;
    continuous?: boolean;
}

export function useSpeech(options: UseSpeechOptions = { lang: 'en-US', continuous: false }) {
    const [transcript, setTranscript] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

    useEffect(() => {
        const browserWindow = window as SpeechRecognitionWindow;
        const SpeechRecognitionAPI =
            browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition;

        if (!SpeechRecognitionAPI) {
            setError('Browser_not_supported');
            return;
        }

        const recognition = new SpeechRecognitionAPI();
        recognition.lang = options.lang ?? 'en-US';
        recognition.continuous = options.continuous ?? false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsRecording(true);
            setError(null);
        };

        recognition.onresult = (event) => {
            // Lấy kết quả text cuối cùng
            const text = event.results[event.results.length - 1][0].transcript;
            setTranscript(text);
        };

        recognition.onerror = (event) => {
            setError(event.error ?? 'Speech_recognition_failed');
            setIsRecording(false);
        };

        recognition.onend = () => {
            setIsRecording(false);
        };

        recognitionRef.current = recognition;

        // Cleanup khi component unmount
        return () => {
            recognition.stop();
            recognitionRef.current = null;
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
        isSupported: error !== 'Browser_not_supported',
        startListening,
        stopListening,
        resetTranscript
    };
}