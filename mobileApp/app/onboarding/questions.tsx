import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useUserInfo } from '../context/UserInfoContext';

interface Question {
  category: string;
  question: string;
  options: string[];
}

export default function QuestionsScreen(): JSX.Element {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? 'light';
  const { firstName,lastName } = useUserInfo();

  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<(string | null)[]>(Array(9).fill(null));
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const questions: Question[] = [
    {
      category: 'Getting to know you',
      question: 'First things first, what age group do you belong to?',
      options: ['18–25', '26–35', '36–45', '46–55']
    },
    {
      category: 'Getting to know you',
      question: 'How would you describe your current work situation?',
      options: ['Student', 'Employed', 'Freelancer/Self-employed', 'Unemployed/Looking for work', 'Other']
    },
    {
      category: 'Your digital habits',
      question: 'How often do you use apps or websites to manage your money?',
      options: ['Daily', 'Weekly', 'Monthly', 'Rarely']
    },
    {
      category: 'Your digital habits',
      question: 'What payment methods do you typically use?',
      options: ['Bank transfers', 'Digital wallet apps', 'Cash', 'Mix of these']
    },
    {
      category: 'Money management',
      question: 'Do you keep track of your monthly budget?',
      options: ['Yes, always', 'Sometimes', 'Rarely', 'Never']
    },
    {
      category: 'Money management',
      question: 'How comfortable are you using financial apps?',
      options: ['Beginner', 'Intermediate', 'Advanced']
    },
    {
      category: 'Your preferences',
      question: 'Would you like to receive savings tips and notifications?',
      options: ['Yes, very interested', 'Maybe, depending on frequency', 'No thanks']
    },
    {
      category: 'Your preferences',
      question: 'How do you prefer to learn about finances?',
      options: ['Quick read articles', 'Short videos (1-2 min)', 'Both']
    },
    {
      category: 'Your goals',
      question: "What's your main financial goal for the next 6 months?",
      options: ['Save for travel', 'Pay off debt', 'Start small investments', 'Improve spending habits', 'Other']
    }
  ];

  const handleSelect = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setIsLoading(true);
      setTimeout(() => {
        router.replace('/onboarding/ready');
      }, 2000);
    }
  };

  const progress = (currentQuestion + 1) / questions.length;

  return (
    <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors[theme].tint} />
          <Text style={[styles.loadingText, { color: Colors[theme].text }]}>
            Analyzing your answers...
          </Text>
        </View>
      ) : (
        <>
          <Text style={[styles.category, { color: Colors[theme].muted }]}>
            {questions[currentQuestion].category}
          </Text>
          <Text style={[styles.title, { color: Colors[theme].text }]}>
            {firstName ? `Hi ${firstName}!` : 'Welcome!'}{"\n"}
            {questions[currentQuestion].question}
          </Text>

          <View style={styles.optionsContainer}>
            {questions[currentQuestion].options.map((option, index) => (
              <Pressable
                key={index}
                onPress={() => handleSelect(option)}
                style={[
                  styles.option,
                  {
                    backgroundColor: answers[currentQuestion] === option
                      ? Colors[theme].tint
                      : Colors[theme].background,
                    borderColor: Colors[theme].tint,
                  },
                ]}
              >
                <Text style={{
                  color: answers[currentQuestion] === option
                    ? '#fff'
                    : Colors[theme].text,
                  fontSize: 16
                }}>
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${progress * 100}%`,
                    backgroundColor: Colors[theme].tint
                  }
                ]}
              />
            </View>
            <Text style={{ textAlign: 'center', color: Colors[theme].muted, marginTop: 4 }}>
              {currentQuestion + 1} of {questions.length}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  category: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: 24,
  },
  option: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
  },
  progressContainer: {
    marginTop: 32,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '500',
  },
});
