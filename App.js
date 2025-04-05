import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Vibration,
  ImageBackground,
} from 'react-native';

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function App() {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [highlighted, setHighlighted] = useState(null);
  const [error, setError] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [gameStarted, setGameStarted] = useState(false);
  const [phase, setPhase] = useState(1);
  const [score, setScore] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [record, setRecord] = useState(0);

  const screenWidth = Dimensions.get('window').width;
  const gridSize = Math.min(screenWidth * 0.9, 350);
  const buttonSize = gridSize / 3.3;

  useEffect(() => {
    if (gameStarted) {
      startRound();
    }
  }, [gameStarted]);

  useEffect(() => {
    if (sequence.length > 0 && gameStarted) {
      showSequence();
    }
  }, [sequence]);

  const startRound = () => {
    setError(false);
    setUserSequence([]);
    const newSpeed = Math.max(speed * (0.9 - phase * 0.05), 300);
    setSpeed(newSpeed);

    const addCount = Math.floor(phase / 2) + 1;
    const updatedSequence = [...sequence];
    for (let i = 0; i < addCount; i++) {
      updatedSequence.push(Math.floor(Math.random() * numbers.length));
    }
    setSequence(updatedSequence);
  };

  const showSequence = () => {
    let i = 0;
    const interval = setInterval(() => {
      setHighlighted(sequence[i]);
      setTimeout(() => setHighlighted(null), speed / 2);
      i++;
      if (i >= sequence.length) clearInterval(interval);
    }, speed);
  };

  const handlePress = (index) => {
    if (error) return;

    const nextSequence = [...userSequence, index];
    setUserSequence(nextSequence);

    if (index !== sequence[userSequence.length]) {
      setError(true);
      Vibration.vibrate(500);
      return;
    }

    setScore((prev) => prev + 10);

    if (nextSequence.length === sequence.length) {
      setRounds((prevRounds) => {
        const updatedRounds = prevRounds + 1;
        if (updatedRounds % 3 === 0) {
          setPhase((prevPhase) => prevPhase + 1);
          setScore((prevScore) => prevScore + 50);
        }
        return updatedRounds;
      });

      setRecord((prev) => Math.max(prev, score + 10));
      setTimeout(startRound, 1000);
    }
  };

  const restartGame = () => {
    setError(false);
    setSequence([]);
    setUserSequence([]);
    setSpeed(1000);
    setScore(0);
    setPhase(1);
    setRounds(0);
    setGameStarted(false);
  };

  const startGame = () => setGameStarted(true);

  const getDifficultyLabel = () => {
    const levels = ['Fácil', 'Médio', 'Difícil', 'Expert'];
    return levels[Math.min(phase - 1, 3)];
  };

  return (
    <View style={styles.container}>
      {!gameStarted ? (
        <ImageBackground
          source={require('./assets/BG/Welcome/WelcomeBG.png')}
          resizeMode="cover"
          style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>O cofre de Kaneshiro</Text>
          <Text style={styles.subtitleText}>
            Memorize a sequência para roubar o coração de Kaneshiro e fazê-lo
            confessar seus crimes!
          </Text>
          <Text style={styles.highScoreText}>Recorde: {record}</Text>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>Jogar</Text>
          </TouchableOpacity>
        </ImageBackground>
      ) : (
        <ImageBackground
          source={require('./assets/BG/Welcome/WelcomeBG.png')}
          style={styles.gameContainer}>
          <View style={styles.header}>
            <Text style={styles.phaseText}>Fase: {phase}</Text>
            <Text style={styles.scoreText}>Pontos: {score}</Text>
            <Text style={styles.difficultyText}>{getDifficultyLabel()}</Text>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Ops! Errou!</Text>
              <Text style={styles.finalScoreText}>Pontuação: {score}</Text>
              <TouchableOpacity
                style={styles.restartButton}
                onPress={restartGame}>
                <Text style={styles.restartButtonText}>Jogar novamente</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={[styles.grid, { width: gridSize, height: gridSize }]}>
            {numbers.map((num, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  {
                    width: buttonSize,
                    height: buttonSize,
                    backgroundColor:
                      index === highlighted ? '#ffffff' : '#d20005',
                  },
                ]}
                onPress={() => handlePress(index)}
                activeOpacity={0.7}>
                <Text style={styles.buttonText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ImageBackground>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3e5f5',
  },
  welcomeContainer: {
    alignItems: 'center',
    backgroundColor: 'black',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    height: '100%',
  },
  welcomeText: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  highScoreText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: '#d20005',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 3,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  phaseText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  difficultyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    backgroundColor: '#1c1c1c',
    borderRadius: 15,
    padding: 10,
    elevation: 5,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 5,
    width: '100%',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  finalScoreText: {
    fontSize: 18,
    color: '#7b1fa2',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  restartButton: {
    backgroundColor: '#ff9800',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
  },
  restartButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
