import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { createSession, updateSession } from "../../api/api";
import { QUESTIONS } from "../../constants/questions";

export default function LearnScreen() {
  const backgroundColor = "#0b0f10";
  const cardColor = "#11181c";
  const textColor = "#f5f5f5";
  const accentColor = "#4da6ff";

  const [current, setCurrent] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [selected, setSelected] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    startSession();
  }, []);

  const startSession = async () => {
    try {
      const session = await createSession();
      if (session?.id) {
        setSessionId(session.id);
        setStartTime(Date.now());
      }
    } catch (error) {
      console.error("Session error:", error);
    }
  };

  const question = QUESTIONS[current];

  if (!question) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={{ color: textColor }}>Loading...</Text>
      </View>
    );
  }

  const handleAnswer = (index: number) => {
    if (selected !== null) return;

    const isCorrect = index === question.correctIndex;

    const newAttempts = attempts + 1;
    const newCorrectAnswers = isCorrect ? correctAnswers + 1 : correctAnswers;

    setSelected(index);
    setAttempts(newAttempts);
    setCorrectAnswers(newCorrectAnswers);

    setTimeout(() => {
      setSelected(null);

      if (current + 1 < QUESTIONS.length) {
        setCurrent((prev) => prev + 1);
      } else {
        finishGame(newCorrectAnswers, newAttempts);
      }
    }, 800);
  };

  const finishGame = async (finalCorrect: number, finalAttempts: number) => {
    setGameOver(true);

    if (sessionId) {
      const durationSeconds = startTime
        ? Math.round((Date.now() - startTime) / 1000)
        : 0;

      await updateSession(sessionId, {
        correctAnswers: finalCorrect,
        totalAttempts: finalAttempts,
        duration: durationSeconds,
      });
    }
  };

  if (gameOver) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.title, { color: textColor }]}>Game Complete</Text>

        <Text style={{ color: textColor, marginBottom: 20 }}>
          Score: {correctAnswers}/{attempts}
        </Text>

        <Button title="View Stats" onPress={() => router.push("/earn")} />

        <View style={{ height: 12 }} />

        <Button
          title="Play Again"
          onPress={async () => {
            setCurrent(0);
            setCorrectAnswers(0);
            setAttempts(0);
            setSelected(null);
            setGameOver(false);
            await startSession();
          }}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>
        Spot the Safety Problem
      </Text>

      <View style={[styles.card, { backgroundColor: cardColor }]}>
        {question.image && (
          <Image
            source={question.image}
            style={styles.problemImage}
            resizeMode="contain"
          />
        )}

        {question.options.map((option, index) => {
          const isCorrect = index === question.correctIndex;
          const isSelected = index === selected;

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              style={[
                styles.option,
                { borderColor: accentColor },
                isSelected && (isCorrect ? styles.correct : styles.incorrect),
              ]}
              onPress={() => handleAnswer(index)}
            >
              <Text style={{ color: textColor }}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  problemImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },
  option: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  correct: {
    backgroundColor: "#1f4d2e",
  },
  incorrect: {
    backgroundColor: "#4d1f1f",
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
});
