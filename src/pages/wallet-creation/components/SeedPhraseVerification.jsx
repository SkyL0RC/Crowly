import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SeedPhraseVerification = ({ seedPhrase, onVerified }) => {
  const [verificationWords, setVerificationWords] = useState([]);
  const [selectedWords, setSelectedWords] = useState({});
  const [shuffledOptions, setShuffledOptions] = useState({}); // Object olarak değiştirdik
  const [error, setError] = useState('');

  useEffect(() => {
    // 3 random pozisyon seç
    const indices = [];
    while (indices?.length < 3) {
      const randomIndex = Math.floor(Math.random() * seedPhrase?.length);
      if (!indices?.includes(randomIndex)) {
        indices?.push(randomIndex);
      }
    }
    indices?.sort((a, b) => a - b);
    setVerificationWords(indices);

    // Her pozisyon için 6 kelimelik seçenekler oluştur
    // Doğru kelime + 5 random yanlış kelime
    const optionsPerWord = {};
    indices.forEach(index => {
      const correctWord = seedPhrase[index];
      const wrongWords = seedPhrase
        .filter((word, i) => i !== index) // Doğru kelimeyi hariç tut
        .sort(() => 0.5 - Math.random()) // Karıştır
        .slice(0, 5); // 5 yanlış kelime al
      
      // Doğru kelime + 5 yanlış kelime = 6 seçenek
      const options = [correctWord, ...wrongWords]
        .sort(() => 0.5 - Math.random()); // Tekrar karıştır
      
      optionsPerWord[index] = options;
    });
    
    setShuffledOptions(optionsPerWord);
  }, [seedPhrase]);

  const handleWordSelect = (position, word) => {
    setSelectedWords(prev => ({ ...prev, [position]: word }));
    setError('');
  };

  const handleVerify = () => {
    const isCorrect = verificationWords?.every(
      index => selectedWords?.[index] === seedPhrase?.[index]
    );

    if (isCorrect) {
      onVerified();
    } else {
      setError('Incorrect words selected. Please try again.');
      setSelectedWords({});
    }
  };

  const isComplete = verificationWords?.every(index => selectedWords?.[index]);

  return (
    <div className="space-y-6">
      <div className="glass-card">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-lg bg-accent bg-opacity-20">
            <Icon name="CheckCircle2" size={24} color="var(--color-accent)" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Verify Your Seed Phrase</h3>
            <p className="text-sm text-muted-foreground">
              Select the correct words from your seed phrase to verify you've saved it correctly.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {verificationWords?.map((wordIndex) => (
            <div key={wordIndex} className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Word #{wordIndex + 1}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {shuffledOptions?.[wordIndex]?.map((word, index) => (
                  <button
                    key={index}
                    onClick={() => handleWordSelect(wordIndex, word)}
                    className={`p-3 rounded-lg border text-sm font-mono transition-all duration-150 ${
                      selectedWords?.[wordIndex] === word
                        ? 'bg-accent bg-opacity-20 border-accent text-accent-foreground' :'bg-surface border-border text-foreground hover:border-accent hover:border-opacity-50'
                    }`}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-error bg-opacity-10 border border-error border-opacity-30 rounded-lg mt-4">
            <Icon name="XCircle" size={16} color="var(--color-error)" />
            <span className="text-sm text-error">{error}</span>
          </div>
        )}
      </div>
      <Button
        variant="default"
        fullWidth
        iconName="Check"
        iconPosition="right"
        onClick={handleVerify}
        disabled={!isComplete}
      >
        Verify and Create Wallet
      </Button>
    </div>
  );
};

export default SeedPhraseVerification;